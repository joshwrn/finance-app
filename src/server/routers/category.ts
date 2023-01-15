import prisma from '@lib/prisma'
import { CategorySchema } from '@lib/zod/category'
import { z } from 'zod'

import { router, procedure } from '../trpc'

/**
 * It's important to always explicitly say which fields you want to return in order to not
 * leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */

const PaginationSchema = z.object({
  take: z.number().min(1).max(100).default(10).nullish(),
  cursor: z.string().nullish(),
})

export const categoryRouter = router({
  list: procedure
    .input(
      CategorySchema.pick({
        userId: true,
        categoryType: true,
      }).merge(PaginationSchema),
    )
    .query(async ({ input }) => {
      const take = input.take ?? 50
      const { cursor } = input
      const categories = await prisma.category.findMany({
        where: { userId: input.userId },
        take: take + 1,
        cursor: cursor
          ? {
              id: cursor,
            }
          : undefined,
        include: {
          items: {
            where: {
              datePurchased:
                input.categoryType === `WISHLIST` ? null : { not: null },
            },
            include: {
              subItems: true,
            },
          },
        },
      })
      let nextCursor: typeof cursor | undefined = undefined
      if (categories.length > take) {
        const nextItem = categories?.pop()
        nextCursor = nextItem?.id
      }
      return {
        categories: categories,
        nextCursor,
      }
    }),
  create: procedure
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
      }),
    )
    .mutation(async ({ input }) => {
      const category = await prisma.category.delete({
        where: {
          id: input.id,
        },
      })
      await prisma.item.deleteMany({
        where: {
          categoryId: input.id,
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
