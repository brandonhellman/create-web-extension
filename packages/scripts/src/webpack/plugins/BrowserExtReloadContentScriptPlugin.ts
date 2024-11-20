import webpack from 'webpack';

const banner = `
(() => {
  console.log('Reloading content script...');
})();
`;

export function BrowserExtReloadContentScriptPlugin(entries: any) {
  return new webpack.BannerPlugin({
    raw: true,
    entryOnly: true,
    include: Object.keys(entries),
    banner: banner,
  });
}
