import { type CreateNextContextOptions } from '@trpc/server/adapters/next';

export const createContext = async ({ req, res }: CreateNextContextOptions) => {
  if (req.headers.authorization) {
    const userId = req.headers.authorization.split(' ')[1];
    console.log('userId', userId);
  }

  return {
    req,
    res,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
