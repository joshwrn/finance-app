import type { CreateCategoryInput } from '@lib/zod/category'
import type { CategoryType } from '@prisma/client'
import { useUser } from '@state/user'
import { useQueryClient } from '@tanstack/react-query'
import type { RouterInput, RouterOutput } from '@utils/trpc'
import { trpc } from '@utils/trpc'
import { useRouter } from 'next/router'
import { atom, useRecoilValue, useSetRecoilState } from 'recoil'
import type { z } from 'zod'

import type { CategoryWithItems } from '~/prisma/prismaTypes'

import { appRouter } from '../../server/routers/_app'

export const categoryState = atom<CategoryWithItems[]>({
  key: `category`,
  default: [],
})

export const useCategories = (): { categories: CategoryWithItems[] } => {
  const categories = useRecoilValue(categoryState)
  return { categories }
}

type UseCategoryList = (input: { categoryType: CategoryType }) => {
  data?: { categories: CategoryWithItems[] }
  error: unknown
}

type ListCategoriesInput = RouterInput[`category`][`list`]
type ListCategoriesResult = RouterOutput[`category`][`list`]

type UpdateList = (prev: ListCategoriesResult) => ListCategoriesResult

export const useUpdateList = (): { refetch: () => void } => {
  const client = useQueryClient()
  const user = useUser()
  const page = useRouter().pathname.includes(`wishlist`) ? `WISHLIST` : `EXPENSE`

  const refetch = () => {
    client.refetchQueries<ListCategoriesResult>([
      [`category`, `list`],
      {
        input: {
          userId: user.id,
          categoryType: page,
        },
        type: `query`,
      },
    ])
  }

  return { refetch }
}

export const useCategoryListQuery: UseCategoryList = ({ categoryType }) => {
  const user = useUser()
  const setCategories = useSetRecoilState(categoryState)

  const { data, error } = trpc.category.list.useQuery(
    { userId: user.id, categoryType },
    {
      enabled: user.id !== ``,
      placeholderData: { categories: [] },
    },
  )
  return {
    data,
    error,
  }
}

type CreateCategoryInput = RouterInput[`category`][`create`]
export const useCreateCategoryMutation = ({
  action,
}: {
  action?: () => void
}): {
  mutate: (input: z.infer<typeof CreateCategoryInput>) => void
} => {
  const setCategories = useSetRecoilState(categoryState)
  const { refetch } = useUpdateList()
  const create = trpc.category.create.useMutation({
    onMutate: () => {
      action?.()
    },
  })
  const m = async (input: CreateCategoryInput) => {
    const { mutateAsync } = create
    const newData = await mutateAsync(input)
    refetch()
  }
  return { mutate: m }
}

export const useDeleteCategoryMutation = (): {
  mutate: (input: { id: string }) => void
} => {
  const setCategories = useSetRecoilState(categoryState)
  const deleteItem = trpc.category.delete.useMutation()
  const mutate = ({ id }: { id: string }) => {
    deleteItem.mutate({ id })
    setCategories((prev) =>
      prev.filter((category) => {
        return category.id !== id
      }),
    )
  }
  return { mutate }
}
