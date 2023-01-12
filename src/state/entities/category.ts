import type { CategoryType } from '@prisma/client'
import { userState } from '@state/user'
import { trpc } from '@utils/trpc'
import { atom, selectorFamily, useRecoilValue } from 'recoil'

import type { CategoryWithItems } from '~/prisma/prismaTypes'

export const categoryState = atom<CategoryWithItems[]>({
  key: `category`,
  default: [],
})

export const useCategories = (): { categories: CategoryWithItems[] } => {
  const categories = useRecoilValue(categoryState)
  return { categories }
}

// const categoryListState = atom<CategoryWithItems[]>({
//   key: `categoryList`,
//   default: [],
//   effects: [
//     async ({ setSelf, onSet }) => {
//       onSet((newCategories) => {
//         setSelf(newCategories)
//       })
//     },
//   ],
// })

export const categoryListSelector = selectorFamily({
  key: `categoryList`,
  get:
    (categoryType: CategoryType) =>
    async ({ get }) => {
      const userId = get(userState).id
      if (!userId) return []
      const response = await trpc.category.list.query({
        userId,
        categoryType,
      })
      return response.categories
    },
})

// type UseCategoryList = (input: { categoryType: CategoryType }) => {
//   data?: { categories: CategoryWithItems[] }
//   error: unknown
// }
// export const useCategoryListQuery: UseCategoryList = ({ categoryType }) => {
//   const user = useUser()
//   const setCategories = useSetRecoilState(categoryState)

//   const { data, error } = trpc.category.list.useQuery<{
//     categories: CategoryWithItems[]
//   }>(
//     { userId: user.id, categoryType },
//     {
//       enabled: user.id !== ``,
//       placeholderData: { categories: [] },
//       onSuccess: (data) => {
//         setCategories(data?.categories)
//       },
//     },
//   )
//   return {
//     data,
//     error,
//   }
// }

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
