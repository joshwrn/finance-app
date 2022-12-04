import type {
  CreateItemInput,
  CreateSubItemInput,
  ItemSchema,
  ItemWithSubItems,
} from '@lib/zod/item'
import { useUser } from '@state/user'
import { trpc } from '@utils/trpc'
import { useSetRecoilState } from 'recoil'
import type { z } from 'zod'

import { categoryState } from './category'

const useUpdateState = () => {
  const setCategory = useSetRecoilState(categoryState)
  const update = ({
    modifier,
    categoryId,
  }: {
    modifier: (prev: ItemWithSubItems[]) => ItemWithSubItems[]
    categoryId: string
  }) => {
    setCategory((prev) =>
      prev.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            items: modifier(category.items),
          }
        }
        return category
      }),
    )
  }
  return update
}

export const useCreateItemMutation = ({
  action,
}: {
  action?: () => void
}): {
  mutate: (input: z.infer<typeof CreateItemInput>) => void
} => {
  const update = useUpdateState()
  const create = trpc.item.create.useMutation({
    onSuccess: (res) => {
      update({
        modifier: (prev) => [...prev, res.item],
        categoryId: res.item.categoryId,
      })
      action?.()
    },
  })
  return { mutate: create.mutate }
}

export const useCreateSubItemMutation = ({
  itemId,
  categoryId,
  action,
}: {
  itemId: string
  categoryId: string
  action?: () => void
}): {
  mutate: (input: z.infer<typeof CreateSubItemInput>) => void
} => {
  const update = useUpdateState()
  const create = trpc.item.createSubItem.useMutation({
    onSuccess: (res) => {
      update({
        modifier: (prev) => {
          return prev.map((item) => {
            if (item.id === itemId) {
              return {
                ...item,
                subItems: [...item.subItems, res],
              }
            }
            return item
          })
        },
        categoryId,
      })

      action?.()
    },
  })
  return { mutate: create.mutate }
}

export const useDeleteItemMutation = (): {
  mutate: (input: { id: string; categoryId: string }) => void
} => {
  const user = useUser()
  const update = useUpdateState()
  const deleteItem = trpc.item.delete.useMutation()
  const mutate = ({ categoryId, id }: { categoryId: string; id: string }) => {
    deleteItem.mutate({ id, userId: user.id })
    update({
      modifier: (prev) => prev.filter((item) => item.id !== id),
      categoryId,
    })
  }
  return { mutate }
}

export const useMoveItemMutation = (): {
  mutate: (input: { id: string; categoryId: string }) => void
} => {
  const update = useUpdateState()
  const moveItem = trpc.item.move.useMutation()
  const mutate = ({ categoryId, id }: { categoryId: string; id: string }) => {
    moveItem.mutate({ id })
    update({
      modifier: (prev) => prev.filter((item) => item.id !== id),
      categoryId,
    })
  }
  return { mutate }
}

export const useSwitchItemCategoryMutation = (): {
  mutate: (input: {
    item: z.infer<typeof ItemSchema>
    newCategoryId: string | null
  }) => void
} => {
  const setCategories = useSetRecoilState(categoryState)
  const moveItem = trpc.item.switchCategory.useMutation()
  const mutate = ({
    newCategoryId,
    item,
  }: {
    newCategoryId: string | null
    item: z.infer<typeof ItemSchema>
  }) => {
    if (!newCategoryId) return
    const oldItemId = item.categoryId
    moveItem.mutate({ id: item.id, newCategoryId })
    setCategories((prev) =>
      prev.map((category) => {
        if (category.id === oldItemId) {
          return {
            ...category,
            items: category.items.filter((i) => i.id !== item.id),
          }
        }
        if (category.id === newCategoryId) {
          return {
            ...category,
            items: [...category.items, { ...item, categoryId: newCategoryId }],
          }
        }
        return category
      }),
    )
  }
  return { mutate }
}
