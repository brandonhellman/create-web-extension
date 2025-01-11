import { createRequire } from 'module';
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
  const flatManifestJson = flatten<any, any>(manifestJson);

  const require = createRequire(import.meta.url);

  const patterns = Object.values(flatManifestJson).reduce<any[]>((acc, value) => {
    if (typeof value === 'string') {
      const parsed = path.parse(value);
      const isCss = parsed.ext === '.css';

      if (isCss) {
        acc.push({
          from: path.join(pathToBrowserExt.root, value),
          to: path.join(chromeTo, value),
          transform: async (content: Buffer) => {
            try {
              const postcssConfigPath = path.join(pathToBrowserExt.root, 'postcss.config.js');
              let plugins = [];

              if (fs.existsSync(postcssConfigPath)) {
                const postcssConfig = require(postcssConfigPath);
                const pluginConfig = postcssConfig.plugins;

                // Handle object-style plugin configuration
                if (pluginConfig && typeof pluginConfig === 'object') {
                  plugins = Object.entries(pluginConfig).map(([pluginName, pluginOptions]) => {
                    const plugin = require(pluginName);
                    return plugin(pluginOptions);
                  });
                }
              }

              const result = await postcss(plugins).process(content.toString(), {
                from: path.join(pathToBrowserExt.root, value),
                to: path.join(chromeTo, value),
              });

              return result.css;
            } catch (error) {
              console.error('Error processing CSS:', error);
              return content;
            }
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
