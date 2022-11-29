import type { FC } from 'react'
import React from 'react'

import useIntersection from '@hooks/useIntersection'
import type { Item as ItemType } from '@prisma/client'
import { currentHoverState, currentDragState } from '@state/drag'
import { useDeleteItemMutation } from '@state/entities/item'
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
  justify-content: space-between;
  align-items: center;
  position: relative;
  width: 100%;
  height: 55px;
  padding: 10px 50px;
  background-color: var(--bg-item);
  border-radius: 16px;
  backdrop-filter: blur(10px);
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
}: {
  item: ItemType
  isCurrentItem?: boolean
  isOverTrash?: boolean
}) => {
  const { name, price, dateAdded, datePurchased, link } = item
  const url = filterHost(link)

  return (
    <Inner>
      <NameContainer>
        {item.group && <BiCategory size={16} />}
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
      {!item.group && <p>{numberToCurrency(price)}</p>}
      <p>{convertDate(datePurchased ?? dateAdded)}</p>
    </Inner>
  )
}

const Item: FC<{
  item: ItemType
  isCurrentItem?: boolean
  isOverTrash?: boolean
}> = ({ item, isCurrentItem = false, isOverTrash = false }) => {
  const { id, categoryId } = item
  const setCurrentItem = useSetRecoilState(currentDragState)
  const setCurrentHover = useSetRecoilState(currentHoverState)
  const [myRef, inViewport] = useIntersection()
  const { mutate } = useDeleteItemMutation()

  const handleDragEnd = () => {
    if (isOverTrash) {
      mutate({ id, categoryId })
    }
    setCurrentHover(null)
    setCurrentItem({ id: null, type: null })
  }

  const handleDragStart = () => {
    setCurrentItem({ id, type: `item` })
  }
  return (
    <ItemContainer
      variants={itemVariants}
      initial={`initial`}
      animate={`animate`}
      exit={`exit`}
      custom={isOverTrash}
      layout={true}
      drag
      dragSnapToOrigin={isOverTrash ? false : true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileDrag={{
        pointerEvents: `none`,
        zIndex: 150,
      }}
      ref={myRef}
    >
      {inViewport && <ItemWithState item={item} isCurrentItem={isCurrentItem} />}
    </ItemContainer>
  )
}

export default Item
