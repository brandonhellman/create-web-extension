import webpack from 'webpack';

import { getConfig } from '../webpack/getConfig';

export async function dev() {
  console.log('Running dev...');

  const config = await getConfig('development');

  webpack(config).watch(
    {
      aggregateTimeout: 300,
      poll: 1000,
    },
    (err, stats) => {
      if (err) {
        console.error(err);
        return;
      }

      if (!stats) {
        console.error('No stats returned');
        return;
      }

      const info = stats.toJson();

      if (stats.hasErrors()) {
        console.error(info.errors);
        return;
      }

      if (stats.hasWarnings()) {
        console.warn(info.warnings);
        return;
      }

      console.log(`Built in ${info.time}ms`);
    },
  );
}
