import { router } from '../trpc';
import { apiRouter, type ApiRouter } from './api/apiRouter';
import { upcellRouter, type UpcellRouter } from './upcell/upcellRouter';
import { userRouter, type UserRouter } from './user/userRouter';

export const appRouter = router<{
  api: ApiRouter;
  upcell: UpcellRouter;
  user: UserRouter;
}>({
  api: apiRouter,
  upcell: upcellRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
