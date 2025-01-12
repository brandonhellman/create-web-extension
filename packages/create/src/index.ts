#!/usr/bin/env node
import { confirm, select } from '@inquirer/prompts';
import { Command } from 'commander';

const program = new Command();

// Available examples
const examples = ['with-all', 'with-supabase', 'with-tailwind'] as const;
type Example = (typeof examples)[number];

async function main() {
  program
    .name('create-browser-ext')
    .description('Create a new browser extension')
    .option('-w, --with <example>', 'Create project from example')
    .parse(process.argv);

  const options = program.opts();

  // If example is provided via --with flag
  if (options.with) {
    if (!examples.includes(options.with)) {
      console.error(`Error: Example '${options.with}' not found. Available examples: ${examples.join(', ')}`);
      process.exit(1);
    }

    // TODO: Implement example copying
    console.error('Not implemented yet');
    process.exit(1);
  }

  // Interactive mode
  const useExample = await confirm({
    message: 'Would you like to use an example?',
  });

  if (!useExample) {
    console.error('Not implemented yet');
    process.exit(1);
  }

  const selectedExample = await select<Example>({
    message: 'Select an example to use:',
    choices: examples.map((example) => ({
      name: example,
      value: example,
      description: `Create project from ${example} example`,
    })),
  });

  // TODO: Implement example copying
  console.error('Not implemented yet');
  process.exit(1);
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
