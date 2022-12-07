import type { FC } from 'react'
import React from 'react'

import { anchorPointState, contextMenuState } from '@components/ContextMenu'
import useIntersection from '@hooks/useIntersection'
import type { ItemWithSubItems } from '@lib/zod/item'
import type { SubItem } from '@prisma/client'
import {
  currentHoverState,
  currentDragState,
  DEFAULT_HOVER_STATE,
} from '@state/drag'
import {
  useDeleteItemMutation,
  useMoveItemMutation,
  useSwitchItemCategoryMutation,
} from '@state/entities/item'
import { convertDate, filterHost, numberToCurrency } from '@utils/utils'
import type { Variants } from 'framer-motion'
import { motion } from 'framer-motion'
import { BiCategory } from 'react-icons/bi'
import { useSetRecoilState } from 'recoil'
import styled, { keyframes } from 'styled-components'

import { tableLayout } from '../TableLabels'

const fade = keyframes`
  from {
    opacity: 0;
    filter: blur(10px);
  }
  to {
    opacity: 1;
    filter: blur(0);
  }
`
const Inner = styled.div`
  width: 100%;
  height: 100%;
  /* opacity: 0; */
  display: flex;
  align-items: center;
  /* animation: ${fade} 0.15s ease-in-out forwards; */
  ${tableLayout}
`

export const ItemContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: relative;
  width: 100%;
  padding: 18px 50px;
  background-color: var(--bg-item);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid var(--bg-item);
  a {
    user-select: none;
    -webkit-user-drag: none;
  }
  a,
  p {
    color: var(--fc-secondary);
  }
`
const NameContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  position: relative;
  svg {
    fill: var(--fc-tertiary);
    cursor: pointer;
  }
`
const SubItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  margin: 10px 0 0 0;
  ${Inner} {
    border-top: 1px solid var(--bg-item);
    padding: 10px 0 0 0;
  }
`

export const itemVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: (isOverTrash: boolean) => ({
    opacity: isOverTrash ? 0.5 : 1,
    scale: isOverTrash ? 0.7 : 1,
    transition: {
      type: `spring`,
      duration: 0.5,
    },
  }),
  exit: (isOverTrash: boolean) => ({
    opacity: 0,
    bottom: isOverTrash ? -500 : 0,
    transition: {
      duration: 0.2,
    },
  }),
}

const ItemWithState = ({
  item,
  isCurrentItem,
  subItem,
  showSubItems,
}: {
  item?: ItemWithSubItems
  isCurrentItem?: boolean
  isOverTrash?: boolean
  subItem?: SubItem
  showSubItems?: boolean
}) => {
  const cur = item || subItem
  if (!cur) return null
  const { name, price, dateAdded, link } = cur
  const url = filterHost(link)

  const hasSubItems = item && item.subItems.length > 0

  return (
    <>
      <Inner>
        <NameContainer>
          {hasSubItems && <BiCategory size={16} />}
          <p>{name}</p>
        </NameContainer>
        <div>
          {link && (
            <a
              href={link}
              onClick={(e) => isCurrentItem && e.preventDefault()}
              target="_blank"
              rel="noopener noreferrer"
            >
              {url} {`->`}
            </a>
          )}
        </div>
        {<p>{numberToCurrency(price)}</p>}
        <p>{convertDate(item?.datePurchased ?? dateAdded)}</p>
      </Inner>
      {showSubItems && hasSubItems && (
        <SubItemContainer>
          {item?.subItems.map((subItem) => (
            <ItemWithState
              key={subItem.id}
              subItem={subItem}
              isCurrentItem={isCurrentItem}
            />
          ))}
        </SubItemContainer>
      )}
    </>
  )
}

const Item: FC<{
  item: ItemWithSubItems
  isCurrentItem?: boolean
  currentHover: { id: string | null; type: string | null }
}> = ({ item, isCurrentItem = false, currentHover }) => {
  const { id, categoryId } = item
  const setCurrentItem = useSetRecoilState(currentDragState)
  const setCurrentHover = useSetRecoilState(currentHoverState)
  const setContextMenu = useSetRecoilState(contextMenuState)
  const setAnchorPoint = useSetRecoilState(anchorPointState)
  const [myRef, inViewport] = useIntersection()
  const { mutate: deleteItem } = useDeleteItemMutation()
  const { mutate: moveItem } = useMoveItemMutation()
  const { mutate: switchCategory } = useSwitchItemCategoryMutation()
  const [showSubItems, setShowSubItems] = React.useState(false)

  const handleDragEnd = () => {
    switch (currentHover.type) {
      case `trash`:
        deleteItem({ id, categoryId })
        break
      case `move`:
        moveItem({ id, categoryId })
        break
      case `category`:
        if (currentHover.id !== categoryId) {
          switchCategory({ item: item, newCategoryId: currentHover.id })
        }
        break
      default:
        break
    }
    setCurrentHover(DEFAULT_HOVER_STATE)
    setCurrentItem({ id: null, type: null })
  }

  const handleDragStart = () => {
    setCurrentItem({ id, type: `item` })
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenu({ type: `item`, item })
    setAnchorPoint({ x: e.pageX, y: e.pageY })
  }
  return (
    <ItemContainer
      variants={itemVariants}
      initial={`initial`}
      animate={`animate`}
      exit={`exit`}
      custom={currentHover.id === id}
      layout={true}
      drag
      dragSnapToOrigin={currentHover.type ? true : false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileDrag={{
        pointerEvents: `none`,
        zIndex: 99999,
      }}
      ref={myRef}
      onContextMenu={handleContextMenu}
      onClick={() => setShowSubItems(!showSubItems)}
    >
      {inViewport && (
        <ItemWithState
          item={item}
          isCurrentItem={isCurrentItem}
          showSubItems={showSubItems}
        />
      )}
    </ItemContainer>
  )
}

export default Item
