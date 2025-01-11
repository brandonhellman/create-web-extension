import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';
import { flatten } from 'flat';
import fs from 'fs-extra';
import postcss from 'postcss';

import { pathToBrowserExt } from '../../utils/pathToBrowserExt';

export function CopyCssManifestPlugin(isDevelopment: boolean) {
  const chromeTo = isDevelopment ? pathToBrowserExt.chromeDev : pathToBrowserExt.chromeProd;
  const firefoxTo = isDevelopment ? pathToBrowserExt.firefoxDev : pathToBrowserExt.firefoxProd;

  const manifestJson = fs.readJSONSync(pathToBrowserExt.manifestJson);

  // Flatten the manifest.json object so we can search for any .css files easily
  const flatManifestJson = flatten<any, any>(manifestJson);

  // Find any .css files in the manifest.json and copy them to the unpacked folder
  const patterns = Object.values(flatManifestJson).reduce<any[]>((acc, value) => {
    if (typeof value === 'string') {
      const parsed = path.parse(value);
      const isCss = parsed.ext === '.css';

      if (isCss) {
        acc.push({
          from: path.join(pathToBrowserExt.root, value),
          to: path.join(chromeTo, value),
          transform: async (content: Buffer) => {
            // Load PostCSS config from the browser extension root
            const postcssConfigPath = path.join(pathToBrowserExt.root, 'postcss.config.js');
            const postcssConfig = fs.existsSync(postcssConfigPath) ? require(postcssConfigPath) : { plugins: [] };

            // Process with PostCSS
            const result = await postcss(postcssConfig.plugins).process(content.toString(), {
              from: path.join(pathToBrowserExt.root, value),
              to: path.join(chromeTo, value),
            });

            return result.css;
          },
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
