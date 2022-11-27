import prisma from '@lib/prisma'
import { CategoryType } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { router, procedure } from '../trpc'

/**
 * Default selector for Post.
 * It's important to always explicitly say which fields you want to return in order to not
 * leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */

export const categoryRouter = router({
  list: procedure
    .input(
      z.object({
        userId: z.string(),
        CategoryType: z.nativeEnum(CategoryType),
      }),
    )
    .query(async ({ input }) => {
      const categories = await prisma.category.findMany({
        where: {
          AND: [{ categoryType: input.CategoryType }, { userId: input.userId }],
        },
        include: { items: true },
      })

      return {
        categories,
      }
    }),
  add: procedure
    .input(
      z.object({
        name: z.string(),
        userId: z.string(),
        categoryType: z.nativeEnum(CategoryType),
      }),
    )
    .mutation(async ({ input }) => {
      const category = await prisma.category.create({
        data: {
          name: input.name,
          userId: input.userId,
          categoryType: input.categoryType,
        },
      })
      return { category }
    }),
})
