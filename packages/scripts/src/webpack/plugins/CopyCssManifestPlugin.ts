import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';
import { flatten } from 'flat';
import fs from 'fs-extra';

import { pathToBrowserExt } from '../../utils/pathToBrowserExt';

export function CopyCssManifestPlugin(isDevelopment: boolean) {
  const chromeTo = isDevelopment ? pathToBrowserExt.chromeDev : pathToBrowserExt.chromeProd;
  const firefoxTo = isDevelopment ? pathToBrowserExt.firefoxDev : pathToBrowserExt.firefoxProd;

  const manifestJson = fs.readJSONSync(pathToBrowserExt.manifestJson);

  // Flatten the manifest.json object so we can search for any .css files easily
  const flatManifestJson = flatten<any, any>(manifestJson);

  // Find any .css files in the manifest.json and copy them to the unpacked folder
  const patterns = Object.values(flatManifestJson).reduce<string[]>((acc: any[], value: any) => {
    if (typeof value === 'string') {
      const parsed = path.parse(value);
      const isCss = parsed.ext === '.css';

      if (isCss) {
        acc.push({
          from: path.join(pathToBrowserExt.root, value),
          to: path.join(chromeTo, value),
        });
      }
    }

    return acc;
  }, []);

  if (!patterns.length) {
    return null;
  }

  return new CopyPlugin({ patterns: patterns });
}
