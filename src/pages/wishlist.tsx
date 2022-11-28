import type { FC } from 'react'

import ActionBar from '@components/ActionBar'
import Category from '@components/Category'
import Header from '@components/Header'
import { NewCategoryButton } from '@components/NewCategoryButton'
import Sidebar from '@components/Sidebar'
import { categoryState, useCategoryListQuery } from '@state/entities/category'
import { useGetUser } from '@state/user'
import { LayoutGroup, motion } from 'framer-motion'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'

import type { CategoryWithItems } from '~/prisma/prismaTypes'

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
  padding: 70px;
  padding-left: 180px;
`
const SectionHeader = styled(Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: relative;
  z-index: 1000;
  padding: 0 30px;
`

const Home: FC = () => {
  useCategoryListQuery({ categoryType: `WISHLIST` })
  useGetUser()
  const categories = useRecoilValue(categoryState)
  return (
    <>
      <Sidebar />
      <ActionBar />
      <Container>
        <SectionHeader>
          <h1>Wishlists</h1>
          <NewCategoryButton />
        </SectionHeader>
        {/* <p>Hello, {user.name?.split(` `)[0]}!</p> */}
        <LayoutGroup>
          {categories.map((category: CategoryWithItems) => (
            <Category key={category.id + `wishlist`} categoryId={category.id} />
          ))}
        </LayoutGroup>
      </Container>
    </>
  )
}

export default Home
