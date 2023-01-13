import { categoryRouter } from './category'
import { itemRouter } from './item'
import { userRouter } from './user'
import { router } from '../trpc'

export const appRouter = router({
  category: categoryRouter,
  item: itemRouter,
  user: userRouter,
})
// export type definition of API
export type AppRouter = typeof appRouter
