import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';
import { flatten } from 'flat';
import fs from 'fs-extra';
import GenerateJsonPlugin from 'generate-json-webpack-plugin';

import { pathToBrowserExt } from '../utils/pathToBrowserExt';

interface Entries {
  [key: string]: any;
}

interface Plugins {
  [key: string]: any;
}

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

function getPngPlugin(manifestJson: any) {
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

export async function getBrowserExt() {
  const entries: Entries = {};
  const plugins: Plugins[] = [];

  // Load the manifest.json file from the browser extension
  const manifestJson = fs.readJSONSync(pathToBrowserExt.manifestJson);
  console.log('manifestJson', manifestJson);

  // Load the package.json file from the browser extension
  const packageJson = fs.readJSONSync(pathToBrowserExt.packageJson);
  console.log('packageJson', packageJson);

  const manifestPlugin = getManifestPlugin(manifestJson, packageJson);
  plugins.push(manifestPlugin);

  const pngPlugin = getPngPlugin(manifestJson);
  plugins.push(pngPlugin);

  return {
    entries,
    plugins,
  };
}
