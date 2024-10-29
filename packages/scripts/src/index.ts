#!/usr/bin/env node

import { program } from "commander";

import { name, version } from "../package.json";
import { build } from "./scripts/build";
import { watch } from "./scripts/watch";

// Setup the program
program.name(name).version(version, "-v, --version").usage("<script> [option]");

// Add the build command
program
  .command("build")
  .description("Build the web extension for production.")
  .action(() => {
    build();
  });

// Add the watch command
program
  .command("watch")
  .description("Watch the web extension for changes and rebuild.")
  .action(() => {
    watch();
  });

// Parse the arguments
program.parse(process.argv);
