import prisma from '@lib/prisma'
import styled from 'styled-components'
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import { UserWithItems } from '@prisma/prismaTypes'
import Header from '@components/Header'
import Category from '@components/Category'
import { CategoryWithItems } from '@prisma/prismaTypes'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  align-items: flex-start;
  position: relative;
  z-index: 2;
  color: rgba(255, 255, 255, 0.7);
  padding: 100px;
`

export default function Home({ user }: { user: string }) {
  const userObj: UserWithItems = JSON.parse(user)
  const categories: CategoryWithItems[] = userObj.categories
  return (
    <Container>
      <Header>
        <h1>Wishlists</h1>
      </Header>
      {categories.map((category: CategoryWithItems) => (
        <Category key={category.id + 'wishlist'} category={category} />
      ))}
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const [user] = [
    await prisma.user.findMany({
      include: {
        categories: {
          where: { categoryType: 'WISHLIST' },
          include: { items: true },
        },
      },
    }),
  ]

  return {
    props: { user: JSON.stringify(user[0]) },
  }
}
