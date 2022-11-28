import type { Item } from '@prisma/client'
import { z } from 'zod'

import type { Properties } from '.'

export const ItemSchema = z.object<Properties<Item>>({
  id: z.string(),
  name: z.string(),
  userId: z.string(),
  price: z.number().nullable(),
  dateAdded: z.date(),
  categoryId: z.string(),
  group: z.boolean(),
  link: z.string().nullable(),
  datePurchased: z.date().nullable(),
})

export const CreateItemInput = ItemSchema.pick({
  name: true,
  userId: true,
  price: true,
  link: true,
  categoryId: true,
})
