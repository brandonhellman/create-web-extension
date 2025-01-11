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

                // Handle plugins from config
                const configPlugins =
                  typeof postcssConfig === 'function' ? postcssConfig().plugins : postcssConfig.plugins;

                plugins = await Promise.all(
                  configPlugins.map(async (plugin: any) => {
                    if (typeof plugin === 'string') {
                      // If plugin is a string, require it and initialize
                      const pluginModule = require(plugin);
                      return pluginModule();
                    } else if (Array.isArray(plugin)) {
                      // Handle [plugin, options] format
                      const [pluginName, options] = plugin;
                      const pluginModule = require(pluginName);
                      return pluginModule(options);
                    } else if (typeof plugin === 'function') {
                      // If it's already a function, use it directly
                      return plugin;
                    }
                    // If it's already initialized, use it as is
                    return plugin;
                  }),
                );
              }

              const result = await postcss(plugins).process(content.toString(), {
                from: path.join(pathToBrowserExt.root, value),
                to: path.join(chromeTo, value),
              });

              return result.css;
            } catch (error) {
              console.error('Error processing CSS:', error);
              return content; // Return original content if processing fails
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
