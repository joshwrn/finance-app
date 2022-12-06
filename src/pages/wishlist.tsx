import type { FC } from 'react'

import ActionBar from '@components/ActionBar/ActionBar'
import Category from '@components/Category/Category'
import { NewCategoryButton } from '@components/Category/NewCategoryButton'
import { contextMenuState } from '@components/ContextMenu'
import Header from '@components/Header'
import CreateNewItemModal from '@components/Item/ItemModal'
import Sidebar from '@components/Sidebar'
import { Modal } from '@hooks/useModal'
import type { ItemWithSubItems } from '@lib/zod/item'
import { categoryState, useCategoryListQuery } from '@state/entities/category'
import { useGetUser } from '@state/user'
import { LayoutGroup, motion } from 'framer-motion'
import { atom, useRecoilState, useRecoilValue } from 'recoil'
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

export const createItemModalState = atom({
  key: `createItemModalState`,
  default: false,
})

const Home: FC = () => {
  useCategoryListQuery({ categoryType: `WISHLIST` })
  useGetUser()
  const categories = useRecoilValue(categoryState)
  const [isOpen, setIsOpen] = useRecoilState(createItemModalState)
  const contextMenu = useRecoilValue(contextMenuState)
  return (
    <>
      <Sidebar />
      <ActionBar />
      <Container>
        <SectionHeader>
          <h1>Wishlist</h1>
          <NewCategoryButton />
        </SectionHeader>
        {/* <p>Hello, {user.name?.split(` `)[0]}!</p> */}
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
          <CreateNewItemModal
            setIsOpen={setIsOpen}
            categoryId={contextMenu.item?.categoryId ?? ``}
            parentItem={contextMenu.item as unknown as ItemWithSubItems}
          />
        </Modal>
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
