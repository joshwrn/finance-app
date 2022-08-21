import type { Item as ItemType } from '@prisma/client'
import type { CategoryWithItems, UserWithItems } from '@prisma/prismaTypes'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { motion } from 'framer-motion'
import { useAtom } from 'jotai'
import { useAtomDevtools } from 'jotai/devtools'
import React, { useState } from 'react'
import { BiCategory } from 'react-icons/bi'
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil'
import styled from 'styled-components'

import { convertDate, filterHost, numberToCurrency } from '~/logic/utils'
import { currentItemState, currentHoverState } from '~/state/drag'

import { tableLayout } from './TableLabels'

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
  ${tableLayout}
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

export const itemVariants = {
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

const Item = ({
  item,
  isCurrentItem,
  isOverTrash,
}: {
  item: ItemType
  isCurrentItem?: boolean
  isOverTrash?: boolean
}) => {
  const { name, price, dateAdded, datePurchased, link, id, categoryId } = item
  const url = filterHost(link)
  const setCurrentItem = useSetRecoilState(currentItemState)
  const setCurrentHover = useSetRecoilState(currentHoverState)
  // const currentItem = useRecoilValue(currentItemState)
  const queryClient = useQueryClient()

  // const isCurrent = currentItem === id

  const deleteItem = useMutation((itemId: string) => {
    return axios.post(`/api/item/delete`, { itemId })
  })

  const handleDragEnd = () => {
    if (isOverTrash) {
      deleteItem.mutate(id)
      queryClient.setQueryData<UserWithItems>([`user`], (oldData) => {
        if (!oldData) return
        return {
          ...oldData,
          categories: oldData.categories.map((category: CategoryWithItems) => {
            if (category.id === categoryId) {
              return {
                ...category,
                items: category.items.filter((item: ItemType) => item.id !== id),
              }
            }
            return category
          }),
        }
      })
    }
    setCurrentHover(null)
    setCurrentItem(null)
  }

  const handleDragStart = () => {
    setCurrentItem(id)
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
    >
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
    </ItemContainer>
  )
}

export default Item
