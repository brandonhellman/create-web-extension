import webpack from 'webpack';
import { WebSocket, WebSocketServer } from 'ws';

import Logger from '../utils/logger';
import { getConfig } from '../webpack/getConfig';

// Track WebSocket connections and webpack watcher
let wss: WebSocketServer | null = null;
let webpackWatcher: webpack.Watching | null = null;
const WEBSOCKET_PORT = 8082;

function setupWebSocketServer() {
  if (wss) {
    wss.close();
    wss = null;
  }

  wss = new WebSocketServer({ port: WEBSOCKET_PORT });

  wss.on('connection', (ws) => {
    Logger.info('Extension connected to dev server');

    ws.on('error', (error) => {
      Logger.error('WebSocket error:', error);
    });

    ws.on('close', () => {
      Logger.info('Extension disconnected from dev server');
    });
  });

  Logger.info(`WebSocket server started on port ${WEBSOCKET_PORT}`);
}

function notifyClientsToReload() {
  if (!wss) return;

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send('reload');
      Logger.info('Sent reload signal to extension');
    }
  });
}

export async function dev() {
  Logger.info('Starting development build...');

  // Start WebSocket server
  setupWebSocketServer();

  const config = await getConfig('development');

  webpackWatcher = webpack(config).watch(
    {
      aggregateTimeout: 300,
      poll: 1000,
    },
    (err, stats) => {
      if (err) {
        Logger.error('Webpack fatal error', err);
        return;
      }

      if (!stats) {
        Logger.error('No stats returned from webpack');
        return;
      }

      const info = stats.toJson();

      // Handle errors
      if (stats.hasErrors()) {
        info.errors?.forEach((error) => {
          Logger.error('Build error', error);
        });
        return;
      }

      // Handle warnings
      if (stats.hasWarnings()) {
        info.warnings?.forEach((warning) => {
          Logger.warn(warning.message || JSON.stringify(warning));
        });
      }

      // Log successful build
      Logger.success(`Build completed in ${info.time}ms`);
      notifyClientsToReload();

      // Optional: Log asset sizes
      info.assets?.forEach((asset) => {
        Logger.info(`Asset: ${asset.name} (${formatBytes(asset.size)})`);
      });
    },
  );

  // Force exit after timeout if graceful shutdown fails
  let forceExit = false;

  process.on('SIGINT', () => {
    if (forceExit) {
      Logger.info('Force exiting...');
      process.exit(1);
      return;
    }

    forceExit = true;
    Logger.info('Shutting down dev server...');

    // Force exit after 3 seconds if graceful shutdown fails
    setTimeout(() => {
      Logger.warn('Could not gracefully shut down within timeout, forcing exit...');
      process.exit(1);
    }, 3000);

    Promise.all([
      new Promise<void>((resolve) => {
        if (wss) {
          wss.close(() => {
            Logger.info('WebSocket server closed');
            resolve();
          });
        } else {
          resolve();
        }
      }),
      new Promise<void>((resolve) => {
        if (webpackWatcher) {
          webpackWatcher.close(() => {
            Logger.info('Webpack watcher closed');
            resolve();
          });
        } else {
          resolve();
        }
      }),
    ]).then(() => {
      Logger.info('Clean shutdown completed');
      process.exit(0);
    });
  });
}

// Utility function to format bytes
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
