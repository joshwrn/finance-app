import React from 'react'

import { ItemType } from '@customTypes/prismaData'
import styled from 'styled-components'
import { convertDate, filterHost, numberToCurrency } from '~/logic/utils'
import { tableLayout } from './TableLabels'
import { Reorder, motion } from 'framer-motion'

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
  const { name, price, dateAdded, datePurchased, link } = item
  const url = filterHost(link)
  return (
    <Reorder.Item value={item}>
      <Container>
        <p>{name}</p>
        <a href={link} target="_blank" rel="noopener noreferrer">
          {url} {'->'}
        </a>
        <p>{numberToCurrency(price)}</p>
        <p>{convertDate(datePurchased ?? dateAdded)}</p>
      </Container>
    </Reorder.Item>
  )
}

export default Item
