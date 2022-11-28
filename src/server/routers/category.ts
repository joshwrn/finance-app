import prisma from '@lib/prisma'
import { CategorySchema } from '@lib/zod/category'
import { z } from 'zod'

import { router, procedure } from '../trpc'

/**
 * It's important to always explicitly say which fields you want to return in order to not
 * leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */

export const categoryRouter = router({
  list: procedure
    .input(
      CategorySchema.pick({
        userId: true,
        categoryType: true,
      }),
    )
    .query(async ({ input }) => {
      const categories = await prisma.category.findMany({
        where: {
          AND: [{ categoryType: input.categoryType }, { userId: input.userId }],
        },
        include: { items: true },
      })
      return {
        categories,
      }
    }),
  add: procedure
    .input(
      z.object(CategorySchema.shape).pick({
        name: true,
        userId: true,
        categoryType: true,
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
  delete: procedure
    .input(
      CategorySchema.pick({
        id: true,
        userId: true,
      }),
    )
    .mutation(async ({ input }) => {
      const category = await prisma.category.delete({
        where: {
          id: input.id,
        },
      })
      return { category }
    }),
  count: procedure
    .input(
      z.object(CategorySchema.shape).pick({
        userId: true,
        categoryType: true,
      }),
    )
    .query(async ({ input }) => {
      const count = await prisma.category.count({
        where: {
          AND: [{ categoryType: input.categoryType }, { userId: input.userId }],
        },
      })
      return {
        count,
      }
    }),
})
