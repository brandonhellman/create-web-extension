import webpack from 'webpack';

import Logger from '../utils/logger';
import { getConfig } from '../webpack/getConfig';

export async function dev() {
  Logger.info('Starting development build...');

  const config = await getConfig('development');

  webpack(config).watch(
    {
      aggregateTimeout: 300,
      poll: 1000,
    },
    (err, stats) => {
      if (err) {
        Logger.error('Webpack fatal error', err);
        return;
      }

      if (!stats) {
        Logger.error('No stats returned from webpack');
        return;
      }

      const info = stats.toJson();

      // Handle errors
      if (stats.hasErrors()) {
        info.errors?.forEach((error) => {
          Logger.error('Build error', error);
        });
        return;
      }

      // Handle warnings
      if (stats.hasWarnings()) {
        info.warnings?.forEach((warning) => {
          Logger.warn(warning.message || JSON.stringify(warning));
        });
      }

      // Log successful build
      Logger.success(`Build completed in ${info.time}ms`);

      // Optional: Log asset sizes
      info.assets?.forEach((asset) => {
        Logger.info(`Asset: ${asset.name} (${formatBytes(asset.size)})`);
      });
    },
  );
}

// Utility function to format bytes
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
