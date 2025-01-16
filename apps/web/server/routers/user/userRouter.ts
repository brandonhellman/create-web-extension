import { router } from '../../trpc';
import { selectUserProcedure } from './procedures/selectUserProcedure';

export const userRouter = router({
  selectUser: selectUserProcedure,
});

export type UserRouter = typeof userRouter;
