import path from 'path';
import fs from 'fs-extra';
import { glob } from 'glob';
import { JSDOM } from 'jsdom';
import { type Configuration } from 'webpack';

import { pathToBrowserExt } from '../utils/pathToBrowserExt';

// Get the entries for the background scripts
function getBackgroundEntries(manifestJson: any) {
  const entries: Configuration['entry'] = {};

  if (manifestJson.background?.service_worker) {
    entries[manifestJson.background.service_worker] = path.join(
      pathToBrowserExt.root,
      manifestJson.background.service_worker,
    );
  }

  return entries;
}

// Get the entries for the content scripts
function getContentScriptEntries(manifestJson: any) {
  const entries: Configuration['entry'] = {};

  if (manifestJson.content_scripts) {
    manifestJson.content_scripts.forEach((contentScript: { js: string[] }) => {
      if (contentScript.js) {
        contentScript.js.forEach((js: string) => {
          entries[js] = path.join(pathToBrowserExt.root, js);
        });
      }
    });
  }

  return entries;
}

// Get the entries in any html files
function getHtmlEntries() {
  const entries: Configuration['entry'] = {};

  glob
    .sync('**/*.html', { cwd: pathToBrowserExt.root, ignore: ['node_modules/**/*', 'build/**/*'] })
    .forEach((htmlFile) => {
      const htmlPath = path.join(pathToBrowserExt.root, htmlFile);
      const dirname = path.dirname(htmlPath);
      const content = fs.readFileSync(htmlPath);
      const dom = new JSDOM(content.toString());

      dom.window.document.querySelectorAll('script').forEach((script) => {
        const scriptPath = path.join(dirname, script.src);
        const scriptExists = fs.pathExistsSync(scriptPath);

        if (scriptExists) {
          const relative = path.relative(pathToBrowserExt.root, scriptPath);
          const parsed = path.parse(relative);
          const name = relative.replace(parsed.ext, '');
          entries[name] = scriptPath;
        }
      });
    });

  return entries;
}

export function getEntries(): Configuration['entry'] {
  const manifestJson = fs.readJSONSync(pathToBrowserExt.manifestJson);

  const entries: Configuration['entry'] = {
    ...getBackgroundEntries(manifestJson),
    ...getContentScriptEntries(manifestJson),
    ...getHtmlEntries(),
  };

  return entries;
}
