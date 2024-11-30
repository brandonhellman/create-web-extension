import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';
import fs from 'fs-extra';
import { glob } from 'glob';

import { pathToBrowserExt } from '../../utils/pathToBrowserExt';

export function CopyWebAccessibleResourcesPlugin() {
  const manifestPath = path.join(pathToBrowserExt.root, 'manifest.json');
  const manifestJson = fs.readJSONSync(manifestPath);

  if (!manifestJson.web_accessible_resources) {
    return null;
  }

  // Get resource patterns from manifest (MV3 format)
  const resourcePatterns: string[] = [];

  // Loop through each resource and add it to the patterns
  manifestJson.web_accessible_resources.forEach((resource: { resources: string[] }) => {
    resourcePatterns.push(...resource.resources);
  });

  // Find all files matching the patterns
  const patterns = resourcePatterns.flatMap((pattern) => {
    return glob
      .sync(pattern, {
        cwd: pathToBrowserExt.root,
        ignore: ['node_modules/**/*', 'build/**/*'],
      })
      .map((file) => ({
        from: path.join(pathToBrowserExt.root, file),
        to: path.join(pathToBrowserExt.chromeDev, file),
      }));
  });

  if (!patterns.length) {
    return null;
  }

  return new CopyPlugin({ patterns });
}
