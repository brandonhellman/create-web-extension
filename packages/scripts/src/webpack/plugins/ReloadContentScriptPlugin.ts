import webpack from 'webpack';

const banner = (port: number) => `
(() => {
  console.log('Reloading content script...');
})();
`;

export function ReloadContentScriptPlugin(options: { entries: webpack.EntryObject; port: number }) {
  return new webpack.BannerPlugin({
    raw: true,
    entryOnly: true,
    include: Object.keys(options.entries),
    banner: banner(options.port),
  });
}
