import prisma from '@lib/prisma'
import type { UserWithItems, CategoryWithItems } from '@prisma/prismaTypes'
import type { GetServerSideProps } from 'next'
import styled from 'styled-components'

import Category from '~/components/Category'
import Header from '~/components/Header'
import Sidebar from '~/components/Sidebar/Sidebar'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
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
  const { categories } = userObj
  return (
    <>
      <Sidebar />
      <Container>
        <Header>
          <h1>Wishlists</h1>
        </Header>
        {categories.map((category: CategoryWithItems) => (
          <Category key={category.id + `wishlist`} category={category} />
        ))}
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
