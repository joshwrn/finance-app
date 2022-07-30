import React from 'react'

import styled from 'styled-components'
import { convertDate, filterHost, numberToCurrency } from '~/logic/utils'
import { tableLayout } from './TableLabels'
import { Reorder, motion } from 'framer-motion'
import { Item as ItemType } from '@prisma/client'
import { useAtomValue, useSetAtom } from 'jotai'
import { useAtomDevtools } from 'jotai/devtools'
import { currentItemState } from '@state/item'
import { trashHoverState } from './Sidebar'

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

  a,
  p {
    color: var(--fc-secondary);
  }

  ${tableLayout}
`

const Item = ({ item }: { item: ItemType }) => {
  const { name, price, dateAdded, datePurchased, link, id } = item
  const url = filterHost(link)
  const setCurrentItem = useSetAtom(currentItemState)
  const trashHover = useAtomValue(trashHoverState)
  const handleDragEnd = () => {
    if (trashHover) console.log('delete item')
    setCurrentItem('')
  }
  return (
    <Reorder.Item
      drag
      onDragStart={() => setCurrentItem(id)}
      onDragEnd={handleDragEnd}
      value={item}
    >
      <Container>
        <p>{name}</p>
        {link && (
          <a href={link} target="_blank" rel="noopener noreferrer">
            {url} {'->'}
          </a>
        )}
        <p>{numberToCurrency(price)}</p>
        <p>{convertDate(datePurchased ?? dateAdded)}</p>
      </Container>
    </Reorder.Item>
  )
}

export default Item
