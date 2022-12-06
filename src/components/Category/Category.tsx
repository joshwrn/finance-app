import type { FC } from 'react'
import React, { useMemo } from 'react'

import Header from '@components/Header'
import Item from '@components/Item/Item'
import useModal from '@hooks/useModal'
import useSticky from '@hooks/useSticky'
import type { ItemWithSubItems } from '@lib/zod/item'
import {
  currentHoverState,
  currentDragState,
  DEFAULT_HOVER_STATE,
} from '@state/drag'
import {
  categoryState,
  useDeleteCategoryMutation,
} from '@state/entities/category'
import { userState } from '@state/user'
import { trpc } from '@utils/trpc'
import { numberToCurrency } from '@utils/utils'
import { AnimatePresence, motion, useDragControls } from 'framer-motion'
import { useRecoilState, useRecoilValue } from 'recoil'
import styled from 'styled-components'

import NewItemButton from '../Button'
import CreateNewItemModal from '../Item/ItemModal'
import TableLabels from '../TableLabels'

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
  z-index: 999;
  top: -1px;
  padding-top: 30px;
  padding-bottom: 30px;
  padding-left: 30px;
  padding-right: 30px;
  border: 1px solid transparent;
  border-radius: 20px;
  margin-top: 15px;
  transition: background-color 0.1s ease-in-out;
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
  :hover {
    ${NewItemButton} {
      opacity: 1;
    }
    background-color: var(--bg-item);
  }
  ${NewItemButton} {
    opacity: 0;
    transition: opacity 0.4s ease-in-out;
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

const Category: FC<{ categoryId: string }> = ({ categoryId }) => {
  const user = useRecoilValue(userState)
  const {
    isLoading,
    isError,
    data: sCount,
  } = trpc.item.count.useQuery({
    categoryId,
    userId: user.id,
  })

  const count = sCount as unknown as number

  const categoryData = useRecoilValue(categoryState).find(
    (c) => c.id === categoryId,
  )

  const items = categoryData?.items || []
  const { setIsOpen, isOpen, Modal } = useModal()
  const total = useMemo(
    () => items.reduce((acc, item) => acc + Number(item.price), 0),
    [items],
  )
  const [isStuck, ref] = useSticky()
  const controls = useDragControls()

  const [currentItem, setCurrentItem] = useRecoilState(currentDragState)
  const [currentHover, setCurrentHover] = useRecoilState(currentHoverState)
  const isOverTrash = currentHover.type === `trash`

  const { mutate } = useDeleteCategoryMutation()
  const handleDragEnd = () => {
    if (isOverTrash) {
      mutate({ id: categoryId })
    }
    setCurrentHover(DEFAULT_HOVER_STATE)
    setCurrentItem({ id: null, type: null })
  }

  const handleDragStart = () => {
    setCurrentItem({ id: categoryId, type: `category` })
  }

  return (
    <Container
      dragListener={false}
      dragControls={controls}
      drag
      layout={true}
      dragSnapToOrigin={currentHover.type ? false : true}
      whileDrag={{
        opacity: 0.35,
        zIndex: 999,
        position: `relative`,
      }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseOver={() =>
        currentItem.type === `item` &&
        setCurrentHover({ id: categoryId, type: `category` })
      }
      onMouseLeave={() => setCurrentHover(DEFAULT_HOVER_STATE)}
    >
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <CreateNewItemModal
          setIsOpen={setIsOpen}
          categoryId={categoryData?.id ?? ``}
        />
      </Modal>
      <HeadingContainer
        onPointerDown={(e) => controls.start(e)}
        ref={ref}
        isStuck={isStuck}
      >
        <Header>
          <h3>{categoryData?.name ?? ``}</h3>
          {!isLoading && !isError && count > 0 && (
            <Badge>
              <p>{count}</p>
            </Badge>
          )}
        </Header>
        <p>
          Total <span>{numberToCurrency(total)}</span>
        </p>
        <NewItemButton onClick={() => setIsOpen(true)}>
          <p>+ New Item</p>
        </NewItemButton>
      </HeadingContainer>
      {items.length > 0 ? (
        <>
          <TableLabels labels={[`Item`, `Link`, `Price`, `Date Added`]} />
          <AnimatePresence initial={false}>
            {items.map((item: ItemWithSubItems) => {
              const isCurrentItem = currentItem.id === item.id
              return (
                <Item
                  item={item}
                  key={item.name + item.id}
                  isCurrentItem={isCurrentItem}
                  currentHover={currentHover}
                />
              )
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
