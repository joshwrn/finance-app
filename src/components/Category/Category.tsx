import type { FC } from 'react'
import React, { useMemo } from 'react'

import { contextMenuState } from '@components/ContextMenu'
import Header from '@components/Header'
import Item from '@components/Item/Item'
import { itemModalState } from '@components/Item/ItemModal'
import useSticky from '@hooks/useSticky'
import type { ItemWithSubItems } from '@lib/zod/item'
import {
  currentHoverState,
  currentDragState,
  DEFAULT_HOVER_STATE,
  anchorPointState,
} from '@state/drag'
import { Category } from '@state/entities/category'
import { userState } from '@state/user'
import { trpc } from '@utils/trpc'
import { numberToCurrency } from '@utils/utils'
import { AnimatePresence, motion, useDragControls } from 'framer-motion'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import styled from 'styled-components'

import NewItemButton from '../Button'
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
    border: 1px solid var(--bg-item);
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

const Category: FC<{ categoryId: string; categoryData: Category }> = ({
  categoryId,
  categoryData,
}) => {
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

  const items = categoryData?.items || []
  const setItemModal = useSetRecoilState(itemModalState)
  const total = useMemo(
    () => items.reduce((acc, item) => acc + Number(item.price), 0),
    [items],
  )
  const [isStuck, ref] = useSticky()
  const controls = useDragControls()

  const currentDrag = useRecoilValue(currentDragState)
  const [currentHover, setCurrentHover] = useRecoilState(currentHoverState)
  const setContextMenu = useSetRecoilState(contextMenuState)
  const setAnchorPoint = useSetRecoilState(anchorPointState)

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({ type: `category`, category: categoryData, show: true })
    setAnchorPoint({ x: e.pageX, y: e.pageY })
  }

  return (
    <Container
      layout={true}
      onContextMenu={handleContextMenu}
      onMouseOver={() =>
        currentDrag.type === `item` &&
        setCurrentHover({ id: categoryId, type: `category` })
      }
      onMouseLeave={() => setCurrentHover(DEFAULT_HOVER_STATE)}
    >
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
        <NewItemButton
          onClick={() =>
            setItemModal({
              isOpen: true,
              mode: `create`,
              categoryId: categoryId,
            })
          }
        >
          <p>+ New Item</p>
        </NewItemButton>
      </HeadingContainer>
      {items.length > 0 ? (
        <>
          <TableLabels labels={[`Item`, `Link`, `Price`, `Date Added`]} />
          <AnimatePresence initial={false}>
            {items.map((item: ItemWithSubItems) => {
              const isCurrentItem = currentDrag.id === item.id
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
