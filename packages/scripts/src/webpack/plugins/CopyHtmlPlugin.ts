import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';
import { glob } from 'glob';

import { pathToBrowserExt } from '../../utils/pathToBrowserExt';

// Find any .html files in the root of the project and copy them to the unpacked folder
export function CopyHtmlPlugin() {
  const chromeTo = process.env.NODE_ENV === 'production' ? pathToBrowserExt.chromeProd : pathToBrowserExt.chromeDev;
  const firefoxTo = process.env.NODE_ENV === 'production' ? pathToBrowserExt.firefoxProd : pathToBrowserExt.firefoxDev;

  const patterns = glob
    .sync('**/*.html', {
      cwd: pathToBrowserExt.root,
      ignore: ['node_modules/**/*', 'build/**/*'],
    })
    .map((htmlFile) => {
      return {
        from: path.join(pathToBrowserExt.root, htmlFile),
        to: path.join(chromeTo, htmlFile),
        transform(content: Buffer, absoluteFrom: string) {
          // Convert the buffer to a string
          const html = content.toString();
          // Replace any script tags with .jsx|.ts|.tsx with .js
          return html.replace(/(<script.*src=".*)(\.jsx|\.ts|\.tsx)(".*)/g, '$1.js$3');
        },
      };
    });

  if (!patterns.length) {
    return null;
  }

  return new CopyPlugin({ patterns: patterns });
}
