#!/usr/bin/env node
import { program } from 'commander';

import { name, version } from '../package.json';
import { build } from './scripts/build';
import { dev } from './scripts/dev';

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
  .action(() => {
    dev({ port: 9000 });
  });

// Parse the arguments
program.parse(process.argv);
