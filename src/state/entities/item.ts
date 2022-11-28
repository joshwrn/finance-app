import type { CreateItemInput } from '@lib/zod/item'
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

export const useDeleteItemMutation = (): {
  mutate: (input: { id: string; categoryId: string }) => void
} => {
  const user = useUser()
  const setCategories = useSetRecoilState(categoryState)
  const deleteItem = trpc.item.delete.useMutation()
  const mutate = ({ categoryId, id }: { categoryId: string; id: string }) => {
    deleteItem.mutate({ id, userId: user.id })
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
