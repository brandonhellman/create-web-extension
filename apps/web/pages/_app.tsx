import { Analytics } from '@vercel/analytics/next';
import { type AppProps } from 'next/app';

import { trpc } from '../utils/trpc';

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}

export default trpc.withTRPC(App);
