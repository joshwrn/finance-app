import type { FC } from 'react'
import { useEffect } from 'react'

import ActionBar from '@components/ActionBar'
import Category from '@components/Category'
import Header from '@components/Header'
import { NewCategoryButton } from '@components/NewCategoryButton'
import Sidebar from '@components/Sidebar'
import { DEFAULT_USER, userState } from '@state/user'
import { trpc } from '@utils/trpc'
import { LayoutGroup, motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import styled from 'styled-components'

import type { CategoryWithItems } from '~/prisma/prismaTypes'

// import RecoilInspector from '~/tools/recoilDevTools/DebugInspector'

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: flex-start;
  align-items: flex-start;
  position: relative;
  overflow: visible;
  z-index: 1;
  color: rgba(255, 255, 255, 0.7);
  padding: 100px;
  padding-left: 180px;
`
const SectionHeader = styled(Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: relative;
  z-index: 1000;
`

const Home: FC = () => {
  const { data: session, status } = useSession()
  const user = useRecoilValue(userState)
  const router = useRouter()

  useEffect(() => {
    if (!session && status === `unauthenticated`) {
      router.push(`/login`)
    }
  }, [session, status])

  const { data } = trpc.category.list.useQuery(
    { userId: user.id, categoryType: `WISHLIST` },
    {
      enabled: user.id !== ``,
      placeholderData: { categories: [] },
    },
  )

  const categories = data?.categories
  const setUser = useSetRecoilState(userState)

  trpc.user.current.useQuery(
    {
      email: session?.user?.email as string,
    },
    {
      placeholderData: DEFAULT_USER,
      enabled: !!session,
      onSuccess: (data) => data.user && setUser(data.user),
    },
  )

  return (
    <>
      <Sidebar />
      <ActionBar />
      <Container>
        <SectionHeader>
          <h1>Wishlists</h1>
          <NewCategoryButton />
        </SectionHeader>
        <p>Hello, {user.name?.split(` `)[0]}!</p>
        <LayoutGroup>
          {categories?.map((category: CategoryWithItems) => (
            <Category key={category.id + `wishlist`} categoryId={category.id} />
          ))}
        </LayoutGroup>
      </Container>
    </>
  )
}

export default Home
