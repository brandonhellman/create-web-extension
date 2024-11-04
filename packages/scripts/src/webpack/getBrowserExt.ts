import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';
import { flatten } from 'flat';
import fs from 'fs-extra';
import GenerateJsonPlugin from 'generate-json-webpack-plugin';
import glob from 'glob';

import { pathToBrowserExt } from '../utils/pathToBrowserExt';

interface Entries {
  [key: string]: any;
}

interface Plugins {
  [key: string]: any;
}

// Get the entries for the background scripts
function getBackgroundEntries(manifestJson: any) {
  const entries: Entries = {};

  if (manifestJson.background?.service_worker) {
    entries['background'] = path.join(pathToBrowserExt.root, manifestJson.background.service_worker);
  }

  return entries;
}

// Get the entries for the content scripts
function getContentScriptEntries(manifestJson: any) {
  const entries: Entries = {};

  return entries;
}

// Get the entries in any html files
function getHtmlEntries() {
  const entries: Entries = {};

  return entries;
}

// Replace special values in the manifest.json file and create a plugin to generate the manifest.json file
function getManifestPlugin(manifestJson: any, packageJson: any) {
  // Clone the json object to avoid changing the original object
  const manifest = { ...manifestJson };

  // Replace special value for the name
  if (manifest.name === '__package.name__') {
    manifest.name = packageJson.name;
  }

  // Replace special value for the version
  if (manifest.version === '__package.version__') {
    manifest.version = packageJson.version;
  }

  // Replace special value for the description
  if (manifest.description === '__package.description__') {
    manifest.description = packageJson.description;
  }

  // Find any .jsx|.ts|.tsx in the background and replace with .js
  if (manifest.background?.service_worker) {
    manifest.background.service_worker = manifest.background.service_worker.replace(/\.(jsx|ts|tsx)/, '.js');
  }

  // Find any .jsx|.ts|.tsx in the content_scripts and replace with .js
  if (manifest.content_scripts) {
    manifest.content_scripts.forEach((contentScript: { js: string[] }) => {
      if (contentScript.js) {
        contentScript.js = contentScript.js.map((js: string) => {
          return js.replace(/\.(jsx|ts|tsx)/, '.js');
        });
      }
    });
  }

  // Find any .jsx|.ts|.tsx in the web_accessible_resources and replace with .js
  if (manifest.web_accessible_resources) {
    manifest.web_accessible_resources.forEach((resource: { resources: string[] }) => {
      if (resource.resources) {
        resource.resources = resource.resources.map((res: string) => {
          return res.replace(/\.(jsx|ts|tsx)/, '.js');
        });
      }
    });
  }

  const manifestPlugin = new GenerateJsonPlugin('manifest.json', manifest);
  return manifestPlugin;
}

// Find any .png files in the manifest.json and copy them to the unpacked folder
function getManifestPngPlugin(manifestJson: any) {
  // Flatten the manifest.json object so we can search for any .png files easily
  const flatManifestJson = flatten<any, any>(manifestJson);

  // Find any .png files in the manifest.json and copy them to the unpacked folder
  const patterns = Object.values(flatManifestJson).reduce<string[]>((acc: any[], value: any) => {
    if (typeof value === 'string') {
      const parsed = path.parse(value);
      const isPng = parsed.ext === '.png';

      if (isPng) {
        acc.push({
          from: path.join(pathToBrowserExt.root, value),
          to: path.join(pathToBrowserExt.unpacked, value),
        });
      }
    }

    return acc;
  }, []);

  const pngPlugin = new CopyPlugin({ patterns: patterns });
  return pngPlugin;
}

// Find any .html files in the manifest.json and copy them to the unpacked folder
function getHtmlPlugin() {
  const patterns = glob.sync('**/*.html', { cwd: pathToBrowserExt.root }).map((htmlFile) => {
    return {
      from: path.join(pathToBrowserExt.root, htmlFile),
      to: path.join(pathToBrowserExt.unpacked, htmlFile),
      transform(content: Buffer, absoluteFrom: string) {
        // Convert the buffer to a string
        const html = content.toString();
        // Replace any script tags with .jsx|.ts|.tsx with .js
        return html.replace(/(<script.*src=".*)(\.jsx|\.ts|\.tsx)(".*)/g, '$1.js$3');
      },
    };
  });

  return new CopyPlugin({ patterns: patterns });
}

// Find any .png files in the html files and copy them to the unpacked folder
function getHtmlPngPlugin() {
  // TODO: Implement this
}

export async function getBrowserExt() {
  // Load the manifest.json and package.json files
  const manifestJson = fs.readJSONSync(pathToBrowserExt.manifestJson);
  const packageJson = fs.readJSONSync(pathToBrowserExt.packageJson);

  // Get the entries
  const entries: Entries = {
    ...getBackgroundEntries(manifestJson),
    ...getContentScriptEntries(manifestJson),
    ...getHtmlEntries(),
  };

  // Get the plugins
  const plugins: Plugins[] = [
    getManifestPlugin(manifestJson, packageJson),
    getManifestPngPlugin(manifestJson),
    getHtmlPlugin(),
  ];

  return {
    entries,
    plugins,
  };
}
