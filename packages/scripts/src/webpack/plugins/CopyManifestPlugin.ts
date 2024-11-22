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
          const manifestJson = JSON.parse(content.toString());

          // If the manifest doesn't have a name, use the package name
          if (!manifestJson.name) {
            manifestJson.name = packageJson.name;
          }

          // If the manifest doesn't have a version, use the package version
          if (!manifestJson.version) {
            manifestJson.version = packageJson.version;
          }

          // If the manifest doesn't have a description, use the package description
          if (!manifestJson.description) {
            manifestJson.description = packageJson.description;
          }

          // Replace file extensions in background.service_worker
          if (manifestJson.background?.service_worker) {
            manifestJson.background.service_worker = manifestJson.background.service_worker.replace(
              /\.(jsx|ts|tsx)/,
              '.js',
            );
          }

          // Replace file extensions in content_scripts
          if (manifestJson.content_scripts) {
            manifestJson.content_scripts.forEach((contentScript: { js: string[] }) => {
              if (contentScript.js) {
                contentScript.js = contentScript.js.map((js) => js.replace(/\.(jsx|ts|tsx)/, '.js'));
              }
            });
          }

          // Replace file extensions in web_accessible_resources
          if (manifestJson.web_accessible_resources) {
            manifestJson.web_accessible_resources.forEach((resource: { resources: string[] }) => {
              if (resource.resources) {
                resource.resources = resource.resources.map((res) => res.replace(/\.(jsx|ts|tsx)/, '.js'));
              }
            });
          }

          // TODO: Type check the manifest against the schema here
          // Return the stringified manifest with pretty printing
          return JSON.stringify(manifestJson, null, 2);
        },
      },
    ],
  });
}
