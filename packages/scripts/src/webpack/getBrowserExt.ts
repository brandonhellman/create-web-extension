import fs from 'fs-extra';
import GenerateJsonPlugin from 'generate-json-webpack-plugin';

import { pathToBrowserExt } from '../utils/pathToBrowserExt';

interface Entries {
  [key: string]: any;
}

interface Plugins {
  [key: string]: any;
}

async function getManifestPlugin(manifestJson: any, packageJson: any) {
  // Clone the json object to avoid changing the original object
  const manifestJsonPlugin = { ...manifestJson };

  // Replace special value for the name
  if (manifestJson.name === '__package.name__') {
    manifestJson.name = packageJson.name;
  }

  // Replace special value for the version
  if (manifestJson.version === '__package.version__') {
    manifestJson.version = packageJson.version;
  }

  const manifestPlugin = new GenerateJsonPlugin('manifest.json', manifestJsonPlugin);
  return manifestPlugin;
}

export async function getBrowserExt() {
  const entries: Entries = {};
  const plugins: Plugins[] = [];

  // Load the manifest.json file from the browser extension
  const manifestJson = fs.readJSONSync(pathToBrowserExt.manifestJson);
  console.log('manifestJson', manifestJson);

  // Load the package.json file from the browser extension
  const packageJson = fs.readJSONSync(pathToBrowserExt.packageJson);
  console.log('packageJson', packageJson);

  const manifestPlugin = getManifestPlugin(manifestJson, packageJson);
  plugins.push(manifestPlugin);

  return {
    entries,
    plugins,
  };
}
