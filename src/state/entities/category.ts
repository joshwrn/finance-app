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

export const useList = (): any => {
  const client = useQueryClient()
  const user = useUser()
  const trpcList = trpc.category.list
  const categoryType = useRouter().pathname.includes(`wishlist`)
    ? `WISHLIST`
    : `EXPENSE`
  const input = { userId: user.id, categoryType } satisfies ListCategoriesInput
  const query = trpcList.useQuery(input, {
    enabled: user.id !== ``,
    placeholderData: { categories: [] },
  })

  const key = trpcList.getQueryKey(input)

  const refetch = () => {
    client.refetchQueries<ListCategoriesResult>(key)
  }

  return {
    query,
    key,
    refetch,
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
  const { refetch } = useList()
  const create = trpc.category.create.useMutation({
    onMutate: () => {
      action?.()
    },
  })
  const m = async (input: CreateCategoryInput) => {
    const { mutateAsync } = create
    await mutateAsync(input)
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
