import { z } from 'zod';

import { procedure } from '../../../trpc';

export const SelectUserInput = z.object({
  userId: z.string(),
});

export type SelectUserInputType = z.infer<typeof SelectUserInput>;

export const SelectUserOutput = z.object({
  id: z.string(),
});

export type SelectUserOutputType = z.infer<typeof SelectUserOutput>;

export const selectUserProcedure = procedure
  .input(SelectUserInput)
  .output(SelectUserOutput)
  .query((opts) => {
    return {
      id: opts.input.userId,
    };
  });
