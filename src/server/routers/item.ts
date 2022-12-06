import prisma from '@lib/prisma'
import { CreateItemInput, CreateSubItemInput, ItemSchema } from '@lib/zod/item'
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
      include: {
        subItems: true,
      },
    })
    return { item }
  }),
  createSubItem: procedure
    .input(CreateSubItemInput.extend({ parentId: z.string() }))
    .mutation(async ({ input }) => {
      const parent = await prisma.item.update({
        where: { id: input.parentId },
        data: { group: true },
      })
      const subItem = await prisma.subItem.create({
        data: {
          name: input.name,
          userId: input.userId,
          price: input.price,
          link: input.link,
          itemId: input.parentId,
          categoryId: parent.categoryId,
        },
      })
      return subItem
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
