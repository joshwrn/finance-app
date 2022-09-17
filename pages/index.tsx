import { RecoilInspector } from '@eyecuelab/recoil-devtools'
import prisma from '@lib/prisma'
import type { UserWithItems, CategoryWithItems } from '@prisma/prismaTypes'
import { useQuery } from '@tanstack/react-query'
import { LayoutGroup, motion } from 'framer-motion'
import type { GetServerSideProps } from 'next'
import styled from 'styled-components'

import ActionBar from '~/components/ActionBar'
import Category from '~/components/Category'
import Header from '~/components/Header'
import Sidebar from '~/components/Sidebar/Sidebar'
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

export default function Home({ user }: { user: string }) {
  const userObj: UserWithItems = JSON.parse(user)
  const { data } = useQuery([`user`], { initialData: userObj })
  const { categories } = data
  const showTools = typeof window !== `undefined`
  return (
    <>
      <Sidebar />
      <ActionBar />
      <Container>
        <Header>
          <h1>Wishlists</h1>
        </Header>
        <LayoutGroup>
          {categories.map((category: CategoryWithItems) => (
            <Category key={category.id + `wishlist`} categoryId={category.id} />
          ))}
        </LayoutGroup>
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const [user] = [
    await prisma.user.findMany({
      include: {
        categories: {
          where: { categoryType: `WISHLIST` },
          include: { items: true },
        },
      },
    }),
  ]

  return {
    props: { user: JSON.stringify(user[0]) },
  }
}
