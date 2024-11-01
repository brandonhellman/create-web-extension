#!/usr/bin/env node
import { program } from 'commander';

import { name, version } from '../package.json';
import { build } from './scripts/build';
import { start } from './scripts/start';

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

// Parse the arguments
program.parse(process.argv);
