import { router } from '../../trpc';
import { logJsonProcedure } from './procedures/logJsonProcedure';

export const apiRouter = router({
  logJson: logJsonProcedure,
});

export type ApiRouter = typeof apiRouter;
