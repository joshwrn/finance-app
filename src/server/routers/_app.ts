import { z } from 'zod'

import { procedure, router } from '../trpc'
import { categoryRouter } from './category'

export const appRouter = router({
  hello: procedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query(({ input }) => {
      return {
        greeting: `hello ${input.text}`,
      }
    }),
  category: categoryRouter,
})
// export type definition of API
export type AppRouter = typeof appRouter
