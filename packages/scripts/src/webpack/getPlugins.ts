import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';
import { flatten } from 'flat';
import fs from 'fs-extra';
import { glob } from 'glob';
import { type Configuration } from 'webpack';

import { pathToBrowserExt } from '../utils/pathToBrowserExt';

// Replace special values in the manifest.json file and create a plugin to generate the manifest.json file
function getManifestPlugin(manifestJson: any, packageJson: any) {
  return new CopyPlugin({
    patterns: [
      {
        from: './manifest.json',
        to: 'manifest.json',
        transform(content) {
          // Parse the manifest template
          const manifest = JSON.parse(content.toString());

          // Replace special values from package.json
          if (manifest.name === '__package.name__') {
            manifest.name = packageJson.name;
          }
          if (manifest.version === '__package.version__') {
            manifest.version = packageJson.version;
          }
          if (manifest.description === '__package.description__') {
            manifest.description = packageJson.description;
          }

          // Replace file extensions in background.service_worker
          if (manifest.background?.service_worker) {
            manifest.background.service_worker = manifest.background.service_worker.replace(/\.(jsx|ts|tsx)/, '.js');
          }

          // Replace file extensions in content_scripts
          if (manifest.content_scripts) {
            manifest.content_scripts.forEach((contentScript: { js: string[] }) => {
              if (contentScript.js) {
                contentScript.js = contentScript.js.map((js: string) => js.replace(/\.(jsx|ts|tsx)/, '.js'));
              }
            });
          }

          // Replace file extensions in web_accessible_resources
          if (manifest.web_accessible_resources) {
            manifest.web_accessible_resources.forEach((resource: { resources: string[] }) => {
              if (resource.resources) {
                resource.resources = resource.resources.map((res: string) => res.replace(/\.(jsx|ts|tsx)/, '.js'));
              }
            });
          }

          // Return the stringified manifest with pretty printing
          return JSON.stringify(manifest, null, 2);
        },
      },
    ],
  });
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

  return new CopyPlugin({ patterns: patterns });
}

// Find any .html files in the manifest.json and copy them to the unpacked folder
function getHtmlPlugin() {
  const patterns = glob
    .sync('**/*.html', { cwd: pathToBrowserExt.root, ignore: ['node_modules/**/*', 'build/**/*'] })
    .map((htmlFile) => {
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

export function getPlugins() {
  const manifestJson = fs.readJSONSync(pathToBrowserExt.manifestJson);
  const packageJson = fs.readJSONSync(pathToBrowserExt.packageJson);

  const plugins: Configuration['plugins'] = [
    getManifestPlugin(manifestJson, packageJson),
    getManifestPngPlugin(manifestJson),
    getHtmlPlugin(),
  ];

  return plugins;
}
