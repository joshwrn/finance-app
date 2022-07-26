import { Prisma } from '@prisma/client'

const categoryWithItems = Prisma.validator<Prisma.CategoryArgs>()({
  include: {
    items: true,
  },
})

const userWithItems = Prisma.validator<Prisma.UserArgs>()({
  include: { categories: { include: { items: true } } },
})

export type UserWithItems = Prisma.UserGetPayload<typeof userWithItems>
export type CategoryWithItems = Prisma.CategoryGetPayload<
  typeof categoryWithItems
>
