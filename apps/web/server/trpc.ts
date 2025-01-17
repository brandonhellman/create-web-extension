import { initTRPC, TRPCError } from '@trpc/server';
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
  const authorization = opts.ctx.req.headers.authorization;
  const bearer = authorization?.split(' ')[1];
  console.log('logProcedure:bearer', bearer);

  // We should have a valid bearer token.
  if (!bearer) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Missing bearer token',
    });
  }

  // Selec a project from the database based on the bearer token.
  const selectProject = await opts.ctx.supabase
    .from('projects')
    .select('id')
    .eq('token', bearer)
    .limit(1)
    .maybeSingle();

  if (selectProject.error) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: selectProject.error.message,
    });
  }

  if (!selectProject.data) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Could not find a project with the provided token',
    });
  }

  return opts.next({
    ctx: {
      req: opts.ctx.req,
      res: opts.ctx.res,
      supabase: opts.ctx.supabase,
      projectId: selectProject.data.id,
    },
  });
});
