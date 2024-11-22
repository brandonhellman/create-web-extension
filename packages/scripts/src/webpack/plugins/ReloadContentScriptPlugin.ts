import webpack from 'webpack';

const banner = (port: number) => `
(() => {
  function connect() {
    const ws = new WebSocket('ws://localhost:${port}');
        
    ws.onmessage = (event) => {
      if (event.data === 'reload') {
        window.location.reload();
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

export function ReloadContentScriptPlugin(options: { entry: webpack.EntryObject; port: number }) {
  return new webpack.BannerPlugin({
    raw: true,
    entryOnly: true,
    include: Object.keys(options.entry),
    banner: banner(options.port),
  });
}
