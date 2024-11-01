#!/usr/bin/env node
import { program } from 'commander';

import { name, version } from '../package.json';
import { build } from './scripts/build';
import { start } from './scripts/start';
import { zip } from './scripts/zip';

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
  .command('start')
  .description('Start the web extension in development mode.')
  .action(() => {
    start();
  });

// Add the zip command
program
  .command('zip')
  .description('Zip the web extension for distribution.')
  .action(() => {
    zip();
  });

// Parse the arguments
program.parse(process.argv);
