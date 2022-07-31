import React from 'react'
import { Item as ItemType } from '@prisma/client'
import styled from 'styled-components'
import { AnimatePresence } from 'framer-motion'
import Item from './Item'
import { SetState } from '@customTypes'

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

const ItemGroup = ({
  items,
  setItemsArr,
}: {
  items: ItemType[]
  setItemsArr: SetState<ItemType[]>
}) => {
  return (
    <Container>
      <h3>{items[0].group}</h3>
      <AnimatePresence>
        {items.map((item) => (
          <Item
            item={item}
            key={item.name + item.id + items[0].group}
            setItemsArr={setItemsArr}
          />
        ))}
      </AnimatePresence>
    </Container>
  )
}

export default ItemGroup
