import { useEffect } from 'react'

import type { User } from '@prisma/client'
import { trpc } from '@utils/trpc'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { atom, useRecoilValue, useSetRecoilState } from 'recoil'

export const DEFAULT_USER: User = {
  id: ``,
  email: ``,
  emailVerified: null,
  name: ``,
  image: ``,
}

export const userState = atom({
  key: `userState`,
  default: DEFAULT_USER,
})

export const useUser = (): User => {
  const user = useRecoilValue(userState)
  return user
}

export const useGetUser = async (): Promise<void> => {
  const setUser = useSetRecoilState(userState)
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    const get = async (): Promise<void> => {
      const data = await trpc.user.current.query({
        email: session?.user?.email ?? ``,
      })
      setUser(data.user ?? DEFAULT_USER)
    }
    if (!session && status === `unauthenticated`) {
      router.push(`/`)
    } else {
      get()
    }
  }, [session, status])
}
