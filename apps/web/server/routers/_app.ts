import { router } from '../trpc';
import { apiRouter, ApiRouter } from './api/apiRouter';
import { userRouter, UserRouter } from './user/userRouter';

export const appRouter = router<{
  api: ApiRouter;
  user: UserRouter;
}>({
  api: apiRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
