import { getItemCount } from '@axios/items'
import useModal from '@hooks/useModal'
import useSticky from '@hooks/useSticky'
import type { Item as ItemType } from '@prisma/client'
import type { CategoryWithItems, UserWithItems } from '@prisma/prismaTypes'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AnimatePresence, motion, useDragControls } from 'framer-motion'
import React, { useMemo, useState } from 'react'
import { MdOutlineDragIndicator } from 'react-icons/md'
import styled from 'styled-components'

import Header from '~/components/Header'
import Item from '~/components/Item'
import { numberToCurrency } from '~/logic/utils'

import NewItemButton from './Button'
import CreateNewItemModal from './CreateNewItemModal'
import ItemGroup from './ItemGroup'
import TableLabels from './TableLabels'

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  position: relative;
  padding-bottom: 50px;
  border-bottom: 1px solid var(--bg-item);
`
const HeadingContainer = styled.div<{ isStuck: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: fit-content;
  position: sticky;
  z-index: 1;
  top: -1px;
  padding-top: 30px;
  padding-bottom: 30px;
  padding-left: 0;
  padding-right: 0;
  border: 1px solid transparent;
  ::before {
    content: '';
    position: absolute;
    height: 100%;
    left: -100px;
    z-index: -1;
    transition: border 0.5s ease-in-out;
    border-bottom: 1px solid transparent;
    ${({ isStuck }) =>
      isStuck &&
      `
      padding-left: 100px;
      padding-right: 100px;
      backdrop-filter: blur(50px);
      border-bottom: 1px solid var(--bg-item);
      width: 100%;
    `}
  }
  > p {
    margin-left: 30px;
    font-size: 17px;
    span {
      margin-left: 3px;
      color: var(--fc-secondary);
      font-weight: 550;
    }
  }
  svg {
    cursor: pointer;
    path {
      stroke: var(--fc-tertiary);
    }
  }
`
const Badge = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  background: var(--badge-primary);
  top: -5px;
  right: -19px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  p {
    font-size: 12px;
    color: var(--color-white-100);
  }
`

interface ItemWithGroup extends ItemType {
  isGroup?: boolean
  items?: ItemType[]
}

const Category = ({ categoryId }: { categoryId: string }) => {
  const queryClient = useQueryClient()
  const {
    isLoading,
    isError,
    data: count,
  } = useQuery([`itemCountFor${categoryId}`], () => getItemCount(categoryId))

  const data: UserWithItems | undefined = queryClient.getQueryData([`user`])
  const categoryData = data?.categories.find(
    (category: CategoryWithItems) => category.id === categoryId,
  )

  const items = categoryData?.items || []
  const { setIsOpen, isOpen, Modal } = useModal()
  const total = useMemo(
    () => items.reduce((acc, item) => acc + Number(item.price), 0),
    [items],
  )
  const [isStuck, ref] = useSticky()
  const controls = useDragControls()

  return (
    <Container
      dragListener={false}
      dragControls={controls}
      drag
      dragSnapToOrigin
      whileDrag={{
        scale: 0.5,
        opacity: 0.5,
        translateX: `25%`,
        translateY: `-20%`,
      }}
    >
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <CreateNewItemModal
          setIsOpen={setIsOpen}
          categoryId={categoryData?.id ?? ``}
        />
      </Modal>
      <HeadingContainer ref={ref} isStuck={isStuck}>
        <Header>
          <h3>{categoryData?.name ?? ``}</h3>
          {!isLoading && !isError && count?.data > 0 && (
            <Badge>
              <p>{count.data}</p>
            </Badge>
          )}
        </Header>
        <p>
          Total <span>{numberToCurrency(total)}</span>
        </p>
        <NewItemButton onClick={() => setIsOpen(true)}>
          <p>+ New Item</p>
        </NewItemButton>
        <MdOutlineDragIndicator
          size={30}
          onPointerDown={(e) => controls.start(e)}
        />
      </HeadingContainer>
      {items.length > 0 ? (
        <>
          <TableLabels labels={[`Item`, `Link`, `Price`, `Date Added`]} />
          <AnimatePresence>
            {items.map((item: ItemWithGroup) => {
              if (!item.isGroup) {
                return <Item item={item} key={item.name + item.id} />
              } else if (item.isGroup && item.items) {
                return <ItemGroup key={item.name + `group`} items={item.items} />
              }
            })}
          </AnimatePresence>
        </>
      ) : (
        <p>No items yet</p>
      )}
    </Container>
  )
}

export default Category
