import path from 'path';
import fs from 'fs-extra';
import { glob } from 'glob';
import { JSDOM } from 'jsdom';
import webpack from 'webpack';

import { pathToBrowserExt } from '../utils/pathToBrowserExt';

// Get the entry from a path
function getEntry(entryPath: string) {
  const relativePath = path.relative(pathToBrowserExt.root, entryPath);
  const parsedPath = path.parse(relativePath);
  const name = relativePath.replace(parsedPath.ext, '');

  return {
    name: name,
    // TODO: There has to be a better way to do this
    path: './' + relativePath,
  };
}

// Get the entries for the background scripts
function getBackgroundEntries(manifestJson: any) {
  const entries: webpack.Configuration['entry'] = {};

  const serviceWorker = manifestJson.background?.service_worker;

  if (serviceWorker) {
    const entry = getEntry(serviceWorker);
    entries[entry.name] = entry.path;
  }

  return entries;
}

// Get the entries for the content scripts
function getContentScriptEntries(manifestJson: any) {
  const entries: webpack.Configuration['entry'] = {};

  const contentScripts = manifestJson.content_scripts;

  if (contentScripts) {
    contentScripts.forEach((contentScript: { js: string[] }) => {
      if (contentScript.js) {
        contentScript.js.forEach((js: string) => {
          const entry = getEntry(js);
          entries[entry.name] = entry.path;
        });
      }
    });
  }

  return entries;
}

// Get the entries in any html files
function getExtensionPageEntries() {
  const entries: webpack.Configuration['entry'] = {};

  glob
    .sync('**/*.html', { cwd: pathToBrowserExt.root, ignore: ['node_modules/**/*', 'build/**/*'] })
    .forEach((htmlFile) => {
      const htmlPath = path.join(pathToBrowserExt.root, htmlFile);
      const dirname = path.dirname(htmlPath);
      const content = fs.readFileSync(htmlPath);
      const dom = new JSDOM(content.toString());

      dom.window.document.querySelectorAll('script').forEach((script) => {
        const scriptPath = path.join(dirname, script.src);
        const entry = getEntry(scriptPath);
        entries[entry.name] = entry.path;
      });
    });

  return entries;
}

export function getEntries() {
  const manifestJson = fs.readJSONSync(pathToBrowserExt.manifestJson);

  const backgroundEntries = getBackgroundEntries(manifestJson);
  const contentScriptEntries = getContentScriptEntries(manifestJson);
  const extensionPageEntries = getExtensionPageEntries();

  return {
    background: backgroundEntries,
    contentScript: contentScriptEntries,
    extensionPage: extensionPageEntries,
  };
}
