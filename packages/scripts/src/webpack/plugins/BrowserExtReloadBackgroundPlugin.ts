import webpack from 'webpack';

const banner = `
(() => {
  const ws = new WebSocket('ws://localhost:8082');
      
  ws.onmessage = (event) => {
    if (event.data === 'reload') {
      chrome.runtime.reload();
    }
  };

  ws.onclose = () => {
    console.log('Dev server disconnected. Retrying in 1s...');
    setTimeout(() => {
      chrome.runtime.reload();
    }, 1000);
  };
})();
`;

export function BrowserExtReloadBackgroundPlugin(entries: any) {
  return new webpack.BannerPlugin({
    raw: true,
    entryOnly: true,
    include: Object.keys(entries),
    banner: banner,
  });
}
