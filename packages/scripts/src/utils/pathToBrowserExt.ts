import path from 'path';
import fs from 'fs-extra';

// Resolve the path to the browser extension (the working directory)
function resolveToBrowserExt(relativePath: string) {
  return path.resolve(fs.realpathSync(process.cwd()), relativePath);
}

export const pathToBrowserExt = {
  root: resolveToBrowserExt('.'),
  manifestJson: resolveToBrowserExt('manifest.json'),
  packageJson: resolveToBrowserExt('package.json'),
  tsconfigJson: resolveToBrowserExt('tsconfig.json'),
  build: resolveToBrowserExt('build'),
  chromeDev: resolveToBrowserExt('build/chrome-dev/'),
  chromeProd: resolveToBrowserExt('build/chrome-prod/'),
  firefoxDev: resolveToBrowserExt('build/firefox-dev/'),
  firefoxProd: resolveToBrowserExt('build/firefox-prod/'),
};
