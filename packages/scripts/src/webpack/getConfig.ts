import webpack from 'webpack';

import { pathToBrowserExt } from '../utils/pathToBrowserExt';
import { CopyHtmlPlugin } from './plugins/CopyHtmlPlugin';
import { CopyManifestPlugin } from './plugins/CopyManifestPlugin';
import { CopyPngHtmlPlugin } from './plugins/CopyPngHtmlPlugin';
import { CopyPngManifestPlugin } from './plugins/CopyPngManifestPlugin';
import { ReloadBackgroundPlugin } from './plugins/ReloadBackgroundPlugin';
import { ReloadContentPlugin } from './plugins/ReloadContentPlugin';

export function getConfig(options: {
  entry: {
    background: webpack.EntryObject;
    contentScript: webpack.EntryObject;
    extensionPage: webpack.EntryObject;
  };
  mode: 'development' | 'production';
  port: number;
}): webpack.Configuration {
  const isDevelopment = options.mode === 'development';
  const isProduction = options.mode === 'production';

  const config: webpack.Configuration = {
    mode: options.mode,

    entry: {
      ...options.entry.background,
      ...options.entry.contentScript,
      ...options.entry.extensionPage,
    },

    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: isDevelopment, // Faster builds in development
              compilerOptions: {
                sourceMap: isDevelopment,
              },
            },
          },
          exclude: /node_modules/,
        },
      ],
    },

    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.css'],
    },

    output: {
      path: pathToBrowserExt.chromeDev,
      clean: true, // Clean the output directory before emit
      filename: '[name].js',
      chunkFilename: '[name].chunk.js',
    },

    optimization: {
      splitChunks: {
        chunks: 'all',
        name: 'vendor',
        minSize: isDevelopment ? 999999999 : 20000, // Don't split chunks in development for faster builds
      },
    },

    performance: {
      hints: isProduction ? 'warning' : false,
    },
  };

  if (isDevelopment) {
    return {
      ...config,

      // Add plugins
      plugins: [
        CopyManifestPlugin(),
        CopyHtmlPlugin(),
        CopyPngManifestPlugin(),
        CopyPngHtmlPlugin(),
        ReloadBackgroundPlugin({ entry: options.entry.background, port: options.port }),
        ReloadContentPlugin({ entry: options.entry.contentScript, port: options.port }),
      ].filter(Boolean),

      // Add development-specific settings
      devtool: 'inline-source-map',
      stats: 'errors-warnings',
      cache: {
        type: 'filesystem',
      },
    };
  }

  if (isProduction) {
    return {
      ...config,

      // Add plugins
      plugins: [CopyManifestPlugin(), CopyHtmlPlugin(), CopyPngManifestPlugin(), CopyPngHtmlPlugin()].filter(Boolean),

      // Add production-specific settings
      devtool: 'source-map', // Generates separate source maps
      optimization: {
        ...config.optimization,
        minimize: true,
        moduleIds: 'deterministic',
      },
    };
  }

  throw new Error('Invalid mode');
}
