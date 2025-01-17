import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { logProcedure } from '../../../trpc';

export const LogJsonInput = z.object({}).passthrough();

export type LogJsonInputType = z.infer<typeof LogJsonInput>;

export const LogJsonOutput = z.object({
  success: z.boolean(),
});

export type LogJsonOutputType = z.infer<typeof LogJsonOutput>;

export const logJsonProcedure = logProcedure
  .meta({
    openapi: {
      method: 'POST',
      path: '/log/json',
    },
  })
  .input(LogJsonInput)
  .output(LogJsonOutput)
  .query(async (opts) => {
    const insertLog = await opts.ctx.supabase.from('logs').insert({
      projectId: opts.ctx.projectId,
      json: opts.input as any,
    });

    if (insertLog.error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: insertLog.error.message,
      });
    }

    return {
      success: true,
    };
  });
