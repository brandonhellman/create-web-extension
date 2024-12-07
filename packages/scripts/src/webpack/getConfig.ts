import webpack from 'webpack';

import { pathToBrowserExt } from '../utils/pathToBrowserExt';
import { CopyHtmlPlugin } from './plugins/CopyHtmlPlugin';
import { CopyManifestPlugin } from './plugins/CopyManifestPlugin';
import { CopyPngHtmlPlugin } from './plugins/CopyPngHtmlPlugin';
import { CopyPngManifestPlugin } from './plugins/CopyPngManifestPlugin';
import { CopyWebAccessibleResourcesPlugin } from './plugins/CopyWebAccessibleResourcesPlugin';
import { ReloadBackgroundPlugin } from './plugins/ReloadBackgroundPlugin';
import { ReloadContentPlugin } from './plugins/ReloadContentPlugin';
import { ReloadPagePlugin } from './plugins/ReloadPagePlugin';

export function getConfig(options: {
  entry: {
    background: webpack.EntryObject;
    contentScript: webpack.EntryObject;
    extensionPage: webpack.EntryObject;
  };
  mode: 'development' | 'production';
  port: number;
  reload: boolean;
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
          // Handle TypeScript and React files
          test: /\.(ts|tsx)$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-typescript',
                ['@babel/preset-react', { runtime: 'automatic' }],
              ],
              // Enable caching for faster rebuilds
              cacheDirectory: true,
            },
          },
          exclude: /node_modules/,
        },
        {
          // Handle CSS files
          test: /\.css$/,
          use: [
            'style-loader', // Injects CSS into the DOM
            'css-loader', // Handles CSS imports
          ],
        },
        {
          // Handle SVG files as React components
          test: /\.svg$/,
          use: ['@svgr/webpack'],
        },
      ],
    },

    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.css'],
    },

    output: {
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
    const basePlugins = [
      CopyManifestPlugin(),
      CopyHtmlPlugin(),
      CopyPngManifestPlugin(),
      CopyPngHtmlPlugin(),
      CopyWebAccessibleResourcesPlugin(),
    ];

    // Only add reload plugins if auto reload is enabled
    const reloadPlugins = options.reload
      ? [
          ReloadBackgroundPlugin({ entry: options.entry.background, port: options.port }),
          ReloadContentPlugin({ entry: options.entry.contentScript, port: options.port }),
          ReloadPagePlugin({ entry: options.entry.extensionPage, port: options.port }),
        ]
      : [];

    return {
      ...config,

      // Add plugins
      plugins: [...basePlugins, ...reloadPlugins].filter(Boolean),

      // Add development-specific settings
      devtool: 'inline-source-map',
      stats: 'errors-warnings',
      cache: {
        type: 'filesystem',
      },
      output: {
        ...config.output,
        path: pathToBrowserExt.chromeDev,
      },
    };
  }

  if (isProduction) {
    return {
      ...config,

      // Add plugins
      plugins: [
        CopyManifestPlugin(),
        CopyHtmlPlugin(),
        CopyPngManifestPlugin(),
        CopyPngHtmlPlugin(),
        CopyWebAccessibleResourcesPlugin(),
      ].filter(Boolean),

      // Add production-specific settings
      devtool: 'source-map', // Generates separate source maps
      optimization: {
        ...config.optimization,
        minimize: true,
        moduleIds: 'deterministic',
      },
      output: {
        ...config.output,
        path: pathToBrowserExt.chromeProd,
      },
    };
  }

  throw new Error('Invalid mode');
}
