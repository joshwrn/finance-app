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

export const useCreateItemMutation = ({
  categoryId,
  action,
}: {
  categoryId: string
  action?: () => void
}): {
  mutate: (input: z.infer<typeof CreateItemInput>) => void
} => {
  const setCategories = useSetRecoilState(categoryState)
  const create = trpc.item.create.useMutation({
    onSuccess: (res) => {
      setCategories((prev) =>
        prev.map((category) => {
          return category.id === categoryId
            ? { ...category, items: [...category.items, res.item] }
            : category
        }),
      )
      action?.()
    },
  })
  return { mutate: create.mutate }
}

export const useEditItemMutation = ({
  categoryId,
  onSuccess,
}: {
  categoryId: string
  onSuccess?: () => void
}): {
  mutate: (input: z.infer<typeof CreateItemInput> & { id: string }) => void
} => {
  const setCategories = useSetRecoilState(categoryState)
  const edit = trpc.item.edit.useMutation({
    onSuccess: (res) => {
      setCategories((prev) =>
        prev.map((category) => {
          return category.id === categoryId
            ? {
                ...category,
                items: category.items.map((i) =>
                  i.id === res.item.id ? res.item : i,
                ),
              }
            : category
        }),
      )
      onSuccess?.()
    },
  })
  return { mutate: edit.mutate }
}

export const useCreateSubItemMutation = ({
  parentItem,
  action,
}: {
  parentItem?: ItemWithSubItems | null
  action?: () => void
}): {
  mutate: (
    input: z.infer<typeof CreateSubItemInput> & { parentId: string },
  ) => void
} => {
  const setCategories = useSetRecoilState(categoryState)
  const create = trpc.item.createSubItem.useMutation()
  const use = async (
    input: z.infer<typeof CreateSubItemInput> & { parentId: string },
  ) => {
    const data = await create.mutateAsync(input)
    if (!parentItem) {
      return
    }
    setCategories((prev) =>
      prev.map((category) => {
        return category.id === parentItem.categoryId
          ? {
              ...category,
              items: category.items.map((i) =>
                i.id === parentItem.id
                  ? { ...i, group: true, subItems: [...i.subItems, data] }
                  : i,
              ),
            }
          : category
      }),
    )
    action?.()
  }
  return { mutate: use }
}

export const useDeleteItemMutation = (): {
  mutate: (input: { id: string; categoryId: string }) => void
} => {
  const user = useUser()
  const setCategories = useSetRecoilState(categoryState)
  const deleteItem = trpc.item.delete.useMutation()
  const mutate = async ({
    categoryId,
    id,
  }: {
    categoryId: string
    id: string
  }) => {
    deleteItem.mutateAsync({ id, userId: user.id })
    setCategories((prev) =>
      prev.map((category) => {
        return category.id === categoryId
          ? {
              ...category,
              items: category.items.filter((item) => item.id !== id),
            }
          : category
      }),
    )
  }
  return { mutate }
}

export const useMoveItemMutation = (): {
  mutate: (input: { id: string; categoryId: string }) => void
} => {
  const setCategories = useSetRecoilState(categoryState)
  const moveItem = trpc.item.move.useMutation()
  const mutate = ({ categoryId, id }: { categoryId: string; id: string }) => {
    moveItem.mutate({ id })
    setCategories((prev) =>
      prev.map((category) => {
        return category.id === categoryId
          ? {
              ...category,
              items: category.items.filter((item) => item.id !== id),
            }
          : category
      }),
    )
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
