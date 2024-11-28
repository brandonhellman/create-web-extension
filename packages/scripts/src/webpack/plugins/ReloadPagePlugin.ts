import webpack from 'webpack';

const banner = (port: number) => `
(() => {
  function connect() {
    const ws = new WebSocket('ws://localhost:${port}');
        
    ws.onmessage = (event) => {
      // Only reload on background-specific reload message
      if (event.data === 'reload-page') {
        chrome.runtime.reload();
      }
    };

    ws.onclose = () => {
      console.log('Dev server disconnected. Retrying in 1s...');
      setTimeout(connect, 1000);
    };
  }

  connect();
})();
`;

export function ReloadPagePlugin(options: { entry: webpack.EntryObject; port: number }) {
  return new webpack.BannerPlugin({
    raw: true,
    entryOnly: true,
    include: Object.keys(options.entry),
    banner: banner(options.port),
  });
}
