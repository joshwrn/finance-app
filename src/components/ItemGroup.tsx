import type { FC } from 'react'
import React from 'react'

import type { Item as ItemType } from '@prisma/client'
import { AnimatePresence } from 'framer-motion'
import styled from 'styled-components'

import Item from './Item'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  position: relative;
`

const ItemGroup: FC<{ items: ItemType[] }> = ({ items }) => {
  return (
    <Container>
      <h3>{items[0].group}</h3>
      <AnimatePresence>
        {items.map((item) => (
          <Item item={item} key={item.name + item.id + items[0].group} />
        ))}
      </AnimatePresence>
    </Container>
  )
}

export default ItemGroup
