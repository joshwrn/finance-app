import type { SetState } from '@customTypes'
import type { Item as ItemType } from '@prisma/client'
import { motion } from 'framer-motion'
import { useAtom } from 'jotai'
import { useAtomDevtools } from 'jotai/devtools'
import React from 'react'
import styled from 'styled-components'

import { convertDate, filterHost, numberToCurrency } from '~/logic/utils'
import { currentItemState, currentHoverState } from '~/state/drag'

import { tableLayout } from './TableLabels'

const Container = styled(motion.div)`
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
  ${tableLayout}
`

const itemVariants = {
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
    transition: {
      duration: 0.2,
    },
  }),
}

const Item = ({
  item,
  setItemsArr,
}: {
  item: ItemType
  setItemsArr: SetState<ItemType[]>
}) => {
  const { name, price, dateAdded, datePurchased, link, id } = item
  const url = filterHost(link)
  const [currentItem, setCurrentItem] = useAtom(currentItemState)
  const [currentHover, setCurrentHover] = useAtom(currentHoverState)
  const isCurrentItem = currentItem === id
  const isOverTrash = currentHover === `trash` && isCurrentItem

  const handleDragEnd = () => {
    if (currentHover === `trash`) {
      setItemsArr((itemsArr) => itemsArr.filter((item) => item.id !== id))
    }
    setCurrentItem(null)
    setCurrentHover(null)
  }

  return (
    <Container
      variants={itemVariants}
      initial={`initial`}
      animate={`animate`}
      exit={`exit`}
      custom={isOverTrash}
      layout={true}
      drag
      dragSnapToOrigin={isOverTrash ? false : true}
      onDragStart={() => setCurrentItem(id)}
      onDragEnd={handleDragEnd}
      whileDrag={{
        pointerEvents: `none`,
        zIndex: 5,
      }}
    >
      <p>{name}</p>
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
      <p>{numberToCurrency(price)}</p>
      <p>{convertDate(datePurchased ?? dateAdded)}</p>
    </Container>
  )
}

export default Item
