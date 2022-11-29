import prisma from '@lib/prisma'
import { CreateItemInput, ItemSchema } from '@lib/zod/item'
import { z } from 'zod'

import { router, procedure } from '../trpc'

export const itemRouter = router({
  create: procedure.input(CreateItemInput).mutation(async ({ input }) => {
    const item = await prisma.item.create({
      data: {
        name: input.name,
        userId: input.userId,
        price: input.price,
        link: input.link,
        categoryId: input.categoryId,
      },
    })
    return { item }
  }),
  move: procedure
    .input(
      ItemSchema.pick({
        id: true,
      }),
    )
    .mutation(async ({ input }) => {
      const findItem = await prisma.item.findUnique({
        where: {
          id: input.id,
        },
      })
      if (!findItem) {
        throw new Error(`Item not found`)
      }
      const item = await prisma.item.update({
        where: {
          id: input.id,
        },
        data: {
          datePurchased: findItem.datePurchased ? null : new Date(),
        },
      })
      return { item }
    }),
  switchCategory: procedure
    .input(
      ItemSchema.pick({
        id: true,
      }).extend({ newCategoryId: z.string() }),
    )
    .mutation(async ({ input }) => {
      const item = await prisma.item.update({
        where: {
          id: input.id,
        },
        data: {
          categoryId: input.newCategoryId,
        },
      })
      return { item }
    }),
  delete: procedure
    .input(
      ItemSchema.pick({
        id: true,
        userId: true,
      }),
    )
    .mutation(async ({ input }) => {
      const item = await prisma.item.delete({
        where: {
          id: input.id,
        },
      })
      return { item }
    }),
  count: procedure
    .input(
      ItemSchema.pick({
        userId: true,
        categoryId: true,
      }),
    )
    .query(async ({ input }) => {
      const count = await prisma.item.count({
        where: {
          AND: [{ categoryId: input.categoryId }, { userId: input.userId }],
        },
      })
      return {
        count,
      }
    }),
})
