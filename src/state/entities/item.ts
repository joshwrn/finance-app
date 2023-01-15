import type { ItemWithSubItems } from '@lib/zod/item'
import { useUser } from '@state/user'
import type { RouterInput, RouterOutput } from '@utils/trpc'
import { trpc } from '@utils/trpc'

import { useList } from './category'

type CreateItemInput = RouterInput[`item`][`create`]
type ItemResult = RouterOutput[`item`][`create`]

export const useCreateItemMutation = ({
  categoryId,
  action,
}: {
  categoryId: string
  action?: () => void
}): {
  mutate: (input: CreateItemInput) => void
} => {
  const { update } = useList()
  const create = trpc.item.create.useMutation()
  const mutate = async (input: CreateItemInput) => {
    action?.()
    const data = await create.mutateAsync(input)
    update((prev) =>
      prev.map((category) => {
        return category.id === categoryId
          ? { ...category, items: [...category.items, data.item] }
          : category
      }),
    )
    return data
  }
  return { mutate }
}

export const useEditItemMutation = ({
  categoryId,
  onSuccess,
}: {
  categoryId: string
  onSuccess?: () => void
}): {
  mutate: (input: CreateItemInput & { id: string }) => void
} => {
  const { update } = useList()
  const edit = trpc.item.edit.useMutation()

  const mutate = async (input: CreateItemInput & { id: string }) => {
    const data = await edit.mutateAsync(input)
    onSuccess?.()
    update((prev) =>
      prev.map((category) => {
        return category.id === categoryId
          ? {
              ...category,
              items: category.items.map((i) =>
                i.id === data.item.id ? data.item : i,
              ),
            }
          : category
      }),
    )
    return data
  }
  return { mutate }
}

type CreateSubItemInput = RouterInput[`item`][`createSubItem`]

export const useCreateSubItemMutation = ({
  parentItem,
  action,
}: {
  parentItem?: ItemWithSubItems | null
  action?: () => void
}): {
  mutate: (input: CreateSubItemInput & { parentId: string }) => void
} => {
  const create = trpc.item.createSubItem.useMutation()
  const { update } = useList()
  const use = async (input: CreateItemInput & { parentId: string }) => {
    const data = await create.mutateAsync(input)
    if (!parentItem) {
      return
    }
    update((prev) =>
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
  const { update } = useList()
  const deleteItem = trpc.item.delete.useMutation()
  const mutate = async ({
    categoryId,
    id,
  }: {
    categoryId: string
    id: string
  }) => {
    deleteItem.mutateAsync({ id, userId: user.id })
    update((prev) =>
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
  const { update } = useList()
  const moveItem = trpc.item.move.useMutation()
  const mutate = ({ categoryId, id }: { categoryId: string; id: string }) => {
    moveItem.mutate({ id })
    update((prev) =>
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
    item: ItemResult[`item`]
    newCategoryId: string | null
  }) => void
} => {
  const { update } = useList()
  const moveItem = trpc.item.switchCategory.useMutation()
  const mutate = ({
    newCategoryId,
    item,
  }: {
    newCategoryId: string | null
    item: ItemResult[`item`]
  }) => {
    if (!newCategoryId) return
    const oldItemId = item.categoryId
    moveItem.mutate({ id: item.id, newCategoryId })
    update((prev) =>
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
