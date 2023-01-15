import type { FC } from 'react'

import { NewCategoryButton } from '@components/Category/NewCategoryButton'
import Header from '@components/Header'
import CreateNewItemModal, { itemModalState } from '@components/Item/ItemModal'
import Sidebar from '@components/Sidebar'
import { Modal } from '@hooks/useModal'
import type { CategoryType } from '@prisma/client'
import { useList } from '@state/entities/category'
import { useGetUser } from '@state/user'
import { LayoutGroup, motion } from 'framer-motion'
import { useRecoilState } from 'recoil'
import styled from 'styled-components'

import Category from './Category/Category'

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

export const PageWrapper: FC<{ title: string; categoryType: CategoryType }> = ({
  title,
}) => {
  useGetUser()
  const { query } = useList()
  const [itemModal, setItemModal] = useRecoilState(itemModalState)

  const reversedPages = [...(query?.data?.pages ?? [])].reverse()
  console.log(reversedPages)

  return (
    <>
      <Sidebar />
      <Container>
        <SectionHeader>
          <h1>{title}</h1>
          <NewCategoryButton />
        </SectionHeader>
        {/* <p>Hello, {user.name?.split(` `)[0]}!</p> */}
        <Modal
          isOpen={itemModal.isOpen}
          setIsOpen={() =>
            setItemModal({
              categoryId: ``,
              mode: `create`,
              isOpen: false,
            })
          }
        >
          <CreateNewItemModal />
        </Modal>
        <LayoutGroup>
          {reversedPages?.map((page) =>
            page.categories.map((category) => (
              <Category
                key={category.id + title}
                categoryId={category.id}
                categoryData={category}
              />
            )),
          )}
        </LayoutGroup>
        <button onClick={() => query.fetchPreviousPage()}>fetch more</button>
      </Container>
    </>
  )
}
