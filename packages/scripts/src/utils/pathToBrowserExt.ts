import fs from "fs-extra";
import path from "path";

// Resolve the path to the browser extension (the working directory)
function resolveToBrowserExt(relativePath: string) {
  return path.resolve(fs.realpathSync(process.cwd()), relativePath);
}

export const pathToBrowserExt = {
  root: resolveToBrowserExt("."),
  manifestJson: resolveToBrowserExt("manifest.json"),
  packageJson: resolveToBrowserExt("package.json"),
  tsconfigJson: resolveToBrowserExt("tsconfig.json"),
  build: resolveToBrowserExt("/build"),
  unpacked: resolveToBrowserExt("/build/unpacked/"),
};
