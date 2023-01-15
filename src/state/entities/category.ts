import { useUser } from '@state/user'
import type { RouterInput, RouterOutput } from '@utils/trpc'
import { trpc } from '@utils/trpc'
import { useRouter } from 'next/router'

type ListCategoriesInput = RouterInput[`category`][`list`]
type ListCategoriesResult = RouterOutput[`category`][`list`]

const useCategoryParams = () => {
  const user = useUser()
  const categoryType = useRouter().pathname.includes(`wishlist`)
    ? `WISHLIST`
    : `EXPENSE`
  const input = { userId: user.id, categoryType } satisfies ListCategoriesInput
  return input
}

type UpdateList = (
  prev: ListCategoriesResult[`categories`],
) => ListCategoriesResult[`categories`]

export const useList = (): {
  query: ReturnType<typeof trpc.category.list.useQuery>
  update: (fn: UpdateList) => void
  data?: ListCategoriesResult
} => {
  const input = useCategoryParams()
  const ctx = trpc.useContext()
  const query = trpc.category.list.useQuery(input, {
    staleTime: 1000 * 60 * 5,
  })

  const update = (fn: UpdateList) => {
    ctx.category.list.setData(
      input,
      (prev) => prev && { categories: fn(prev.categories) },
    )
  }

  return {
    query,
    data: query.data,
    update,
  }
}

type CreateCategoryInput = RouterInput[`category`][`create`]
export const useCreateCategoryMutation = ({
  action,
}: {
  action?: () => void
}): {
  mutate: (input: CreateCategoryInput) => void
} => {
  const { update } = useList()
  const create = trpc.category.create.useMutation({
    onMutate: () => {
      action?.()
    },
  })
  const mutate = async (input: CreateCategoryInput) => {
    const { mutateAsync } = create
    const data = await mutateAsync(input)
    update((prev) => [
      ...prev,
      {
        ...data.category,
        items: [],
      },
    ])
  }
  return { mutate }
}

export const useDeleteCategoryMutation = (): {
  mutate: (input: { id: string }) => void
} => {
  const { update } = useList()
  const deleteItem = trpc.category.delete.useMutation()
  const mutate = ({ id }: { id: string }) => {
    deleteItem.mutate({ id })
    update((prev) =>
      prev.filter((category) => {
        return category.id !== id
      }),
    )
  }
  return { mutate }
}
