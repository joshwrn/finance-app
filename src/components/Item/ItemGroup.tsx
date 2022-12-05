import type { FC } from 'react'
import React from 'react'

import type { ItemWithSubItems } from '@lib/zod/item'
import { AnimatePresence } from 'framer-motion'
import styled from 'styled-components'

import Item from './Item'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-shrink: 0;
  justify-content: center;
  align-items: flex-start;
  position: relative;
  background-color: var(--bg-item);
  border-radius: 16px;
  h3 {
    padding: 10px 50px;
  }
`

const ItemGroup: FC<{
  item: ItemWithSubItems
  currentHover: { id: string | null; type: string | null }
}> = ({ item, currentHover }) => {
  return (
    <Container>
      <h3>{item.name}</h3>
      <AnimatePresence>
        <Item item={item} currentHover={currentHover} />
        {item.subItems.map((i) => (
          <Item
            currentHover={currentHover}
            item={item}
            subItem={i}
            key={i.name + i.id + item.group}
          />
        ))}
      </AnimatePresence>
    </Container>
  )
}

export default ItemGroup
