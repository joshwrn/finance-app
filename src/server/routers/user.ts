import prisma from '@lib/prisma'
import { z } from 'zod'

import { router, procedure } from '../trpc'

export const userRouter = router({
  current: procedure
    .input(
      z.object({
        email: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: {
          email: input.email,
        },
      })
      if (!user) {
        return {
          message: `User not found`,
        }
      }
      return { user }
    }),
})
