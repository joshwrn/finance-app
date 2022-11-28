import { CategoryType } from '@prisma/client'
import type { Category } from '@prisma/client'
import { z } from 'zod'

import type { Properties } from '.'

// type T = Prisma.CategoryGetPayload<{ include: { items: true } }>

export const CategorySchema = z.object<Properties<Category>>({
  id: z.string(),
  name: z.string(),
  userId: z.string().nullable(),
  categoryType: z.nativeEnum(CategoryType),
})
