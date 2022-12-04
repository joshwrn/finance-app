import type { Prisma, SubItem } from '@prisma/client'
import { z } from 'zod'

import type { Properties } from '.'

export type ItemWithSubItems = Prisma.ItemGetPayload<{
  include: { subItems: true }
}>

export const SubItemSchema = z.object<Properties<SubItem>>({
  id: z.string(),
  name: z.string(),
  userId: z.string(),
  price: z.number().nullable(),
  dateAdded: z.date(),
  link: z.string().nullable(),
  itemId: z.string(),
})

export const CreateSubItemInput = SubItemSchema.pick({
  name: true,
  userId: true,
  price: true,
  link: true,
  itemId: true,
})

export const ItemSchema = z.object<Properties<ItemWithSubItems>>({
  id: z.string(),
  name: z.string(),
  userId: z.string(),
  price: z.number().nullable(),
  dateAdded: z.date(),
  categoryId: z.string(),
  group: z.boolean(),
  link: z.string().nullable(),
  datePurchased: z.date().nullable(),
  subItems: z.array(SubItemSchema),
})

export const CreateItemInput = ItemSchema.pick({
  name: true,
  userId: true,
  price: true,
  link: true,
  categoryId: true,
})
