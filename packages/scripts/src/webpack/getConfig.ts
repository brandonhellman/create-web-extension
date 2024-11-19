import { type Configuration } from 'webpack';

import { pathToBrowserExt } from '../utils/pathToBrowserExt';
import { getEntries } from './getEntries';
import { getPlugins } from './getPlugins';

export async function getConfig(mode: 'development' | 'production'): Promise<Configuration> {
  const entries = getEntries();
  const plugins = getPlugins();

  console.log('entries', entries);
  console.log('');

  plugins?.forEach((plugin) => {
    console.log('plugin', plugin);
    console.log('');
  });

  const config: Configuration = {
    entry: {
      ...entries.background,
      ...entries.contentScript,
      ...entries.extensionPage,
    },

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
      plugins: [...plugins],
    };
  }

  return {
    ...config,
    mode: 'production',
    plugins: [...plugins],
  };
}
