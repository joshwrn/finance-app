import { useUser } from '@state/user'
import type { UseTRPCInfiniteQueryResult } from '@trpc/react-query/shared'
import type { RouterError, RouterInput, RouterOutput } from '@utils/trpc'
import { trpc } from '@utils/trpc'
import { useRouter } from 'next/router'

export type ListCategoriesInput = RouterInput[`category`][`list`]
export type ListCategoriesResult = RouterOutput[`category`][`list`]
export type Category = ListCategoriesResult[`categories`][number]

const useCategoryParams = () => {
  const user = useUser()
  const categoryType = useRouter().pathname.includes(`wishlist`)
    ? `WISHLIST`
    : `EXPENSE`
  const input: ListCategoriesInput = {
    userId: user.id,
    categoryType,
    take: 2,
    cursor: undefined,
  }
  return input
}

type UpdateList = (
  prev: ListCategoriesResult[`categories`],
) => ListCategoriesResult[`categories`]

export const useList = (): {
  query: UseTRPCInfiniteQueryResult<ListCategoriesResult, RouterError>
  update: (fn: UpdateList, categoryId: string) => void
} => {
  const input = useCategoryParams()
  const ctx = trpc.useContext()
  const query = trpc.category.list.useInfiniteQuery(input, {
    staleTime: 1000 * 60 * 5,
    getPreviousPageParam: (firstPage) => firstPage?.nextCursor,
  })

  // console.log(`useList`, query.data)

  const update = (fn: UpdateList, categoryId: string) => {
    ctx.category.list.refetch(input, {
      exact: false,
    })
  }

  return {
    query,
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
    update(
      (prev) => [
        ...prev,
        {
          ...data.category,
          items: [],
        },
      ],
      data.category.id,
    )
  }
  return { mutate }
}

export const useDeleteCategoryMutation = (): {
  mutate: (input: { id: string }) => void
} => {
  const { update } = useList()
  const deleteItem = trpc.category.delete.useMutation()
  const mutate = async ({ id }: { id: string }) => {
    await deleteItem.mutateAsync({ id })
    update(
      (prev) =>
        prev.filter((category) => {
          return category.id !== id
        }),
      id,
    )
  }
  return { mutate }
}
