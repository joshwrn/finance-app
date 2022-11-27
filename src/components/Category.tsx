import type { FC } from 'react'
import React, { useMemo } from 'react'

import Header from '@components/Header'
import Item from '@components/Item'
import useModal from '@hooks/useModal'
import useSticky from '@hooks/useSticky'
import type { Item as ItemType } from '@prisma/client'
import { currentHoverState, currentItemState } from '@state/drag'
import { userState } from '@state/user'
import { useQueryClient } from '@tanstack/react-query'
import { trpc } from '@utils/trpc'
import { numberToCurrency } from '@utils/utils'
import { AnimatePresence, motion, useDragControls } from 'framer-motion'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'

import type { CategoryWithItems } from '~/prisma/prismaTypes'

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
  height: 50px;
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
  :hover {
    ${NewItemButton} {
      opacity: 1;
    }
  }
  ${NewItemButton} {
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
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

const Category: FC<{ categoryId: string }> = ({ categoryId }) => {
  const queryClient = useQueryClient()
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

  const data: { categories: CategoryWithItems[] } | undefined =
    queryClient.getQueryData(
      [
        [`category`, `list`],
        { input: { userId: user.id, categoryType: `WISHLIST` } },
      ],
      { exact: false },
    )

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

  const currentItem = useRecoilValue(currentItemState)
  const currentHover = useRecoilValue(currentHoverState)

  return (
    <Container
      dragListener={false}
      dragControls={controls}
      drag
      layout={true}
      dragSnapToOrigin
      initial={{ height: `auto` }}
      animate={{
        height: `auto`,
      }}
      style={{
        height: `auto`,
      }}
      whileDrag={{
        scale: 0.25,
        opacity: 0.5,
        // translateX: `25%`,
        translateY: `-40%`,
      }}
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
        {/* <MdOutlineDragIndicator
          size={30}
          onPointerDown={(e) => controls.start(e)}
        /> */}
      </HeadingContainer>
      {items.length > 0 ? (
        <>
          <TableLabels labels={[`Item`, `Link`, `Price`, `Date Added`]} />
          <AnimatePresence initial={false}>
            {items.map((item: ItemWithGroup) => {
              if (!item.isGroup) {
                const isCurrentItem = currentItem === item.id
                return (
                  <Item
                    item={item}
                    key={item.name + item.id}
                    isCurrentItem={isCurrentItem}
                    isOverTrash={currentHover === `trash` && isCurrentItem}
                  />
                )
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
