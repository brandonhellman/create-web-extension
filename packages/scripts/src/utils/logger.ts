import chalk from 'chalk';
import { StatsError } from 'webpack';

// Update interface to make it compatible with StatsError
interface ErrorWithModule extends Partial<Error> {
  moduleId?: string;
  moduleName?: string;
  details?: string;
  moduleTrace?: string[];
  message: string; // Only make message required
}

type LogLevel = 'error' | 'info' | 'success' | 'warn' | 'debug';

interface LoggerOptions {
  timestamp?: boolean;
  divider?: boolean;
}

class Logger {
  private static readonly defaultOptions: LoggerOptions = {
    timestamp: true,
    divider: true,
  };

  static #getTimestamp(): string {
    return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  }

  static #formatMessage(level: LogLevel, message: string, options: LoggerOptions = this.defaultOptions): string {
    const parts: string[] = [];

    if (options.timestamp) {
      parts.push(chalk.gray(`[${this.#getTimestamp()}]`));
    }

    const levelColors: Record<LogLevel, typeof chalk> = {
      error: chalk.red,
      info: chalk.blue,
      success: chalk.green,
      warn: chalk.yellow,
      debug: chalk.magenta,
    };

    parts.push(levelColors[level].bold(level.toUpperCase()));
    parts.push(chalk.white(message));

    return parts.join(' ');
  }

  static error(message: string, error?: ErrorWithModule | StatsError): void {
    const opts = { ...this.defaultOptions };

    if (opts.divider) {
      console.log('\n' + chalk.gray('━'.repeat(80)));
    }

    console.log(this.#formatMessage('error', message, opts));

    if ('moduleId' in (error || {})) {
      console.log(chalk.yellow('\nModule:'), chalk.yellow.dim(error?.moduleId));
    }

    if (error?.message) {
      console.log(chalk.yellow('\nDetails:'));
      console.log(chalk.dim(error.message));
    }

    if ('stack' in (error || {}) && error?.stack) {
      console.log(chalk.yellow('\nStack Trace:'));
      const stackLines = error.stack
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.startsWith('at'));

      stackLines.forEach((line) => {
        const parts = line.split('at ');
        if (parts[1]) {
          const [fnName, filePath] = parts[1].split(' (');
          console.log(chalk.dim('  at ') + chalk.blue(fnName) + (filePath ? chalk.dim(` (${filePath}`) : ''));
        }
      });
    }

    if (opts.divider) {
      console.log(chalk.gray('━'.repeat(80)) + '\n');
    }
  }

  static info(message: string, options?: LoggerOptions): void {
    console.log(this.#formatMessage('info', message, options));
  }

  static success(message: string, options?: LoggerOptions): void {
    console.log(this.#formatMessage('success', message, options));
  }

  static warn(message: string, options?: LoggerOptions): void {
    console.log(this.#formatMessage('warn', message, options));
  }

  static debug(message: string, data?: unknown, options?: LoggerOptions): void {
    console.log(this.#formatMessage('debug', message, options));
    if (data) {
      console.log(chalk.dim(JSON.stringify(data, null, 2)));
    }
  }

  // Utility method to log webpack-specific errors
  static webpackError(errors: ErrorWithModule[]): void {
    errors.forEach((error) => {
      this.error('Webpack Build Error', error);
    });
  }
}

export default Logger;
