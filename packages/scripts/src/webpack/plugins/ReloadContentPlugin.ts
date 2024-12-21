import webpack from 'webpack';

const banner = (port: number) => `
(() => {
  function connect() {
    const ws = new WebSocket('ws://localhost:${port}');
    
    // Handle connection errors gracefully without throwing
    ws.onerror = () => {
      console.log('WebSocket connection failed. Retrying in 1s...');
    };
        
    ws.onmessage = (event) => {
      // Only reload on content-script specific reload message
      if (event.data === 'reload-content') {
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

export function ReloadContentPlugin(options: { entry: webpack.EntryObject; port: number }) {
  return new webpack.BannerPlugin({
    raw: true,
    entryOnly: true,
    include: Object.keys(options.entry),
    banner: banner(options.port),
  });
}
