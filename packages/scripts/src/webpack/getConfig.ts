import webpack from 'webpack';

import { pathToBrowserExt } from '../utils/pathToBrowserExt';
import { getEntries } from './getEntries';
import { getPlugins } from './getPlugins';

export async function getConfig(mode: 'development' | 'production'): Promise<webpack.Configuration> {
  const entries = getEntries();
  const plugins = getPlugins();

  const config: webpack.Configuration = {
    entry: {
      ...entries.background,
      ...entries.contentScript,
      ...entries.extensionPage,
    },

    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: mode === 'development', // Faster builds in development
              compilerOptions: {
                sourceMap: mode === 'development',
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
      path: pathToBrowserExt.unpacked,
      clean: true, // Clean the output directory before emit
      filename: '[name].js',
      chunkFilename: '[name].chunk.js',
    },

    optimization: {
      splitChunks: {
        chunks: 'all',
        name: 'vendor',
        minSize: mode === 'development' ? 999999999 : 20000, // Don't split chunks in development for faster builds
      },
    },

    performance: {
      hints: mode === 'production' ? 'warning' : false,
    },
  };

  if (mode === 'development') {
    return {
      ...config,
      mode: 'development',
      devtool: 'inline-source-map',
      plugins: [
        ...plugins,

        // For background script
        new webpack.BannerPlugin({
          raw: true,
          entryOnly: true,
          include: Object.keys(entries.background),
          banner: `
            if (module.hot) { module.hot.accept(); }
            // Background-specific injection code
          `,
        }),

        /*
        // For content script
        new BannerPlugin({
          raw: true,
          entryOnly: true,
          include: ['content'],
          banner: `
            if (module.hot) { module.hot.accept(); }
            // Content-specific injection code
          `,
        }),
        */
      ],
      // Add development-specific settings
      stats: 'errors-warnings',
      cache: {
        type: 'filesystem',
      },
    };
  }

  return {
    ...config,
    mode: 'production',
    plugins: [...plugins],
    // Add production-specific settings
    devtool: 'source-map', // Generates separate source maps
    optimization: {
      ...config.optimization,
      minimize: true,
      moduleIds: 'deterministic',
    },
  };
}
