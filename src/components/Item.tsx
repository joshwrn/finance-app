import type { FC } from 'react'
import React from 'react'

import useIntersection from '@hooks/useIntersection'
import type { Item as ItemType } from '@prisma/client'
import { currentItemState, currentHoverState } from '@state/drag'
import { userState } from '@state/user'
import { useQueryClient } from '@tanstack/react-query'
import { trpc } from '@utils/trpc'
import { convertDate, filterHost, numberToCurrency } from '@utils/utils'
import { motion } from 'framer-motion'
import { BiCategory } from 'react-icons/bi'
import { useSetRecoilState, useRecoilValue } from 'recoil'
import styled, { keyframes } from 'styled-components'

import type { CategoryWithItems } from '~/prisma/prismaTypes'

import { tableLayout } from './TableLabels'

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

export const itemVariants = {
  initial: {
    opacity: 0,
  },
  animate: (isOverTrash: boolean): any => ({
    opacity: isOverTrash ? 0.5 : 1,
    scale: isOverTrash ? 0.7 : 1,
    transition: {
      type: `spring`,
      duration: 0.5,
    },
  }),
  exit: (isOverTrash: boolean): any => ({
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
  const setCurrentItem = useSetRecoilState(currentItemState)
  const user = useRecoilValue(userState)
  const setCurrentHover = useSetRecoilState(currentHoverState)
  const queryClient = useQueryClient()
  const [myRef, inViewport] = useIntersection()

  const deleteItem = trpc.item.delete.useMutation()

  const handleDragEnd = () => {
    if (isOverTrash) {
      deleteItem.mutate({ id, userId: user.id })
      queryClient.setQueryData<{ categories: CategoryWithItems[] }>(
        [
          [`category`, `list`],
          {
            input: { userId: user.id, categoryType: `WISHLIST` },
            type: `query`,
          },
        ],
        (oldData) => {
          if (!oldData) return
          return {
            categories: [
              ...oldData.categories.map((category: CategoryWithItems) => {
                if (category.id === categoryId) {
                  return {
                    ...category,
                    items: category.items.filter(
                      (item: ItemType) => item.id !== id,
                    ),
                  }
                }
                return category
              }),
            ],
          }
        },
      )
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
      ref={myRef}
    >
      {inViewport && <ItemWithState item={item} isCurrentItem={isCurrentItem} />}
    </ItemContainer>
  )
}

export default Item
