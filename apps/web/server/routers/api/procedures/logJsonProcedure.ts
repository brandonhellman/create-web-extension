import { z } from 'zod';

import { logProcedure } from '../../../trpc';

export const LogJsonInput = z.object({});

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
  .query((opts) => {
    return {
      success: true,
    };
  });
