import type { CategoryType } from '@prisma/client'
import { useUser } from '@state/user'
import { trpc } from '@utils/trpc'
import { atom, useSetRecoilState } from 'recoil'

import type { CategoryWithItems } from '~/prisma/prismaTypes'

import type { QueryKey } from '.'

export type CategoryListQueryKey = QueryKey<{
  userId: string
  categoryType: CategoryType
}>

export const categoryListQueryKey: CategoryListQueryKey = ({
  userId,
  categoryType,
}) => [
  [`category`, `list`],
  {
    input: { userId, categoryType },
    type: `query`,
  },
]

export const categoryState = atom<CategoryWithItems[]>({
  key: `category`,
  default: [],
})

type UseCategoryList = (input: { categoryType: CategoryType }) => {
  data?: { categories: CategoryWithItems[] }
  error: unknown
}
export const useCategoryList: UseCategoryList = ({ categoryType }) => {
  const user = useUser()
  const setCategories = useSetRecoilState(categoryState)

  const { data, error } = trpc.category.list.useQuery<{
    categories: CategoryWithItems[]
  }>(
    { userId: user.id, categoryType },
    {
      enabled: user.id !== ``,
      placeholderData: { categories: [] },
      onSuccess: (data) => {
        setCategories(data?.categories)
      },
    },
  )

  return {
    data,
    error,
  }
}
