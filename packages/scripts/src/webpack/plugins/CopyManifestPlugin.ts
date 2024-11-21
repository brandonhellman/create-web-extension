import CopyPlugin from 'copy-webpack-plugin';
import fs from 'fs-extra';

import { pathToBrowserExt } from '../../utils/pathToBrowserExt';

// Replace special values in the manifest.json file and then copy it to the unpacked folder
export function CopyManifestPlugin() {
  const packageJson = fs.readJSONSync(pathToBrowserExt.packageJson);

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
                console.log('resource.resources', resource.resources);
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
