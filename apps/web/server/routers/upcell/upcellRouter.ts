import { router } from '../../trpc';
import { enrichContactProcedure } from './procedures/enrichContactProcedure';

export const upcellRouter = router({
  enrichContact: enrichContactProcedure,
});

export type UpcellRouter = typeof upcellRouter;
