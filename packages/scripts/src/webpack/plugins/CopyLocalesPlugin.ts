import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';

import { pathToBrowserExt } from '../../utils/pathToBrowserExt';

// Copy the _locales folder from the root of the extension to the unpacked folder
export function CopyLocalesPlugin(isDevelopment: boolean) {
  const chromeTo = isDevelopment ? pathToBrowserExt.chromeDev : pathToBrowserExt.chromeProd;
  const firefoxTo = isDevelopment ? pathToBrowserExt.firefoxDev : pathToBrowserExt.firefoxProd;

  return new CopyPlugin({
    patterns: [
      {
        from: './_locales',
        to: path.join(chromeTo, '_locales'),
        noErrorOnMissing: true, // Don't error if _locales folder doesn't exist
      },
      {
        from: './_locales',
        to: path.join(firefoxTo, '_locales'),
        noErrorOnMissing: true, // Don't error if _locales folder doesn't exist
      },
    ],
  });
}
