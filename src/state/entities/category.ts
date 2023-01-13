import { useEffect } from 'react'

import type { CreateCategoryInput } from '@lib/zod/category'
import type { CategoryType } from '@prisma/client'
import { useUser } from '@state/user'
import { trpc } from '@utils/trpc'
import { atom, useRecoilValue, useSetRecoilState } from 'recoil'
import type { z } from 'zod'

import type { CategoryWithItems } from '~/prisma/prismaTypes'

export const categoryState = atom<CategoryWithItems[]>({
  key: `category`,
  default: [],
})

export const useCategories = (): { categories: CategoryWithItems[] } => {
  const categories = useRecoilValue(categoryState)
  return { categories }
}

export const useFetchCategories = (): void => {
  const { query } = trpc.category.list
  const user = useUser().id
  const setList = useSetRecoilState(categoryState)

  useEffect(() => {
    const fetchCategories = async () => {
      const { categories } = await query({
        userId: user,
        categoryType: `WISHLIST`,
      })
      setList(categories)
    }
    fetchCategories()
  }, [user, setList])
}

export const useCreateCategoryMutation = (
  categoryType: CategoryType,
  action: () => void,
): ((input: z.infer<typeof CreateCategoryInput>) => Promise<void>) => {
  const setList = useSetRecoilState(categoryState)
  const create = async (input: z.infer<typeof CreateCategoryInput>) => {
    const { mutate } = trpc.category.create
    const { category } = await mutate(input)
    setList((prev) => [...prev, { ...category, items: [] }])
    action()
  }

  return create
}

// export const useCreateCategoryMutation = ({
//   action,
// }: {
//   action?: () => void
// }): {
//   mutate: (input: z.infer<typeof CreateCategoryInput>) => void
// } => {
//   const setCategories = useSetRecoilState(categoryState)
//   const create = trpc.category.create.useMutation({
//     onSuccess: (res) => {
//       setCategories((prev) => [...prev, { ...res.category, items: [] }])
//     },
//     onMutate: () => {
//       action?.()
//     },
//   })
//   return { mutate: create.mutate }
// }

// export const useDeleteCategoryMutation = (): {
//   mutate: (input: { id: string }) => void
// } => {
//   const setCategories = useSetRecoilState(categoryState)
//   const deleteItem = trpc.category.delete.useMutation()
//   const mutate = ({ id }: { id: string }) => {
//     deleteItem.mutate({ id })
//     setCategories((prev) =>
//       prev.filter((category) => {
//         return category.id !== id
//       }),
//     )
//   }
//   return { mutate }
// }
