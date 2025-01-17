import { type CreateNextContextOptions } from '@trpc/server/adapters/next';

import { supabaseServer } from '../supabase/supabaseServer';

export const createContext = async ({ req, res }: CreateNextContextOptions) => {
  const supabase = supabaseServer();

  return {
    req: req,
    res: res,
    supabase: supabase,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
