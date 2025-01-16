import { initTRPC } from '@trpc/server';
import { OpenApiMeta } from 'trpc-to-openapi';

import { Context } from './context';

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.meta<OpenApiMeta>().context<Context>().create();

// Base router and procedure helpers
export const router = t.router;
export const procedure = t.procedure;

export const logProcedure = t.procedure.use(async (opts) => {
  console.log('logProcedure', opts.ctx.req.headers);

  return opts.next({
    ctx: {
      req: opts.ctx.req,
      res: opts.ctx.res,
    },
  });
});
