import { type Configuration } from 'webpack';

import { pathToBrowserExt } from '../utils/pathToBrowserExt';
import { getEntries } from './getEntries';
import { getPlugins } from './getPlugins';

export async function getConfig(mode: 'development' | 'production'): Promise<Configuration> {
  const entries = getEntries();
  const plugins = getPlugins();

  const config: Configuration = {
    entry: entries,

    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },

    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.css'],
    },

    output: {
      path: pathToBrowserExt.unpacked,
    },
  };

  if (mode === 'development') {
    return {
      ...config,
      devtool: 'inline-source-map',
      mode: 'development',
      plugins: plugins,
    };
  }

  return {
    ...config,
    mode: 'production',
    plugins: plugins,
  };
}
