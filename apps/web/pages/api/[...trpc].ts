import { NextApiRequest, NextApiResponse } from 'next';
import { createOpenApiNextHandler } from 'trpc-to-openapi';

import { createContext } from '../../server/context';
import { appRouter } from '../../server/routers/_app';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '8mb',
    },
    responseLimit: '8mb',
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // TODO: Add CORS configuration

  // Handle incoming OpenAPI requests
  return createOpenApiNextHandler({
    router: appRouter,
    createContext: createContext,
  })(req, res);
}
