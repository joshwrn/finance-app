import prisma from '@lib/prisma'
import styled from 'styled-components'
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import { CategoryType } from '@customTypes/prismaData'
import Header from '@components/Header'
import Category from '@components/Category'

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

export default function Home({ user }) {
  const userObj = JSON.parse(user)
  const categories: CategoryType[] = userObj[0].categories
  return (
    <Container>
      <Header>
        <h1>Wishlists</h1>
      </Header>
      {categories.map((category) => (
        <Category key={category.id + 'wishlist'} category={category} />
      ))}
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const [data] = [
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
    props: { user: JSON.stringify(data) },
  }
}
