#!/usr/bin/env node
import { program } from 'commander';

import { name, version } from '../package.json';
import { build } from './scripts/build';
import { dev } from './scripts/dev';
import Logger from './utils/logger';

// Setup the program
program.name(name).version(version, '-v, --version').usage('<script> [option]');

// Add the build command
program
  .command('build')
  .description('Build the web extension for production.')
  .action(() => {
    build();
  });

// Add the start command
program
  .command('dev')
  .description('Start the web extension in development mode.')
  .option('-p, --port <number>', 'Port to run the development server on', '9000')
  .option('-r --reload <boolean>', 'Reload the extension when changes are made', 'true')
  .action((options) => {
    const port = Number(options.port);
    const reload = options.reload === 'true';

    Logger.info('options', options);

    dev({
      port: port,
      reload: reload,
    });
  });

// Parse the arguments
program.parse(process.argv);
