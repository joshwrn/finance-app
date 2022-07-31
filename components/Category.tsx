import { CategoryWithItems } from '@prisma/prismaTypes'
import React, { useMemo, useState } from 'react'
import Item from '~/components/Item'
import styled from 'styled-components'
import { AnimatePresence, motion, useDragControls } from 'framer-motion'
import Header from '~/components/Header'
import { numberToCurrency } from '~/logic/utils'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import { MdOutlineDragIndicator } from 'react-icons/md'
import TableLabels from './TableLabels'
import ItemGroup from './ItemGroup'
import type { Item as ItemType } from '@prisma/client'
import useModal from '@hooks/useModal'
import CreateNewItemModal from './CreateNewItemModal'
import NewItemButton from './Button'
import { useQuery } from '@tanstack/react-query'
import { getItemCount } from '@axios/items'

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  position: relative;
  padding-bottom: 50px;
  border-bottom: 1px solid var(--bg-item);
`
const HeadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: fit-content;
  position: relative;
  margin: 30px 0;
  h3 {
  }
  > p {
    margin-left: 30px;
    font-size: 17px;
    span {
      margin-left: 3px;
      color: var(--fc-secondary);
      font-weight: 550;
    }
  }
  svg {
    cursor: pointer;
    path {
      stroke: var(--fc-tertiary);
    }
  }
`
const Badge = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  background: var(--badge-primary);
  top: -5px;
  right: -19px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  p {
    font-size: 12px;
    color: var(--fc-primary);
  }
`

interface ItemWithGroup extends ItemType {
  isGroup?: boolean
  items?: ItemType[]
}

const Category = ({ category }: { category: CategoryWithItems }) => {
  const items: ItemType[] = category.items
  const [itemsArr, setItemsArr] = useState<ItemWithGroup[]>(items)
  const {
    isLoading,
    isError,
    data: count,
  } = useQuery([`itemCountFor${category.id}`], () => getItemCount(category.id))
  const { setIsOpen, isOpen, Modal } = useModal()
  const total = useMemo(
    () => items.reduce((acc, item) => acc + Number(item.price), 0),
    [itemsArr]
  )

  const controls = useDragControls()

  // const itemsWithGroup: ItemWithGroup[] = useMemo(() => {
  //   const groups: any[] = []
  //   itemsArr.forEach((item) => {
  //     if (item.group) {
  //       const group = groups.findIndex((group) => group.name === item.group)
  //       if (group === -1) {
  //         groups.push({
  //           name: item.group,
  //           items: [item],
  //           isGroup: true,
  //         })
  //       } else {
  //         groups[group].items.push(item)
  //       }
  //     } else {
  //       groups.push(item)
  //     }
  //   })
  //   return groups
  // }, [itemsArr])

  return (
    <Container
      dragListener={false}
      dragControls={controls}
      drag
      dragSnapToOrigin
      whileDrag={{ scale: 0.5, opacity: 0.5 }}
    >
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <CreateNewItemModal setIsOpen={setIsOpen} categoryId={category.id} />
      </Modal>
      <HeadingContainer>
        <Header>
          <h3>{category.name}</h3>
          {!isLoading && !isError && count?.data > 0 && (
            <Badge>
              <p>{count.data}</p>
            </Badge>
          )}
        </Header>
        <p>
          Total <span>{numberToCurrency(total)}</span>
        </p>
        <NewItemButton onClick={() => setIsOpen(true)}>
          <p>+ New Item</p>
        </NewItemButton>
        <MdOutlineDragIndicator
          size={30}
          onPointerDown={(e) => controls.start(e)}
        />
      </HeadingContainer>
      {items.length > 0 ? (
        <>
          <TableLabels labels={['Item', 'Link', 'Price', 'Date Added']} />
          <AnimatePresence>
            {itemsArr.map((item: ItemWithGroup) => {
              if (!item.isGroup) {
                return (
                  <Item
                    item={item}
                    key={item.name + item.id}
                    setItemsArr={setItemsArr}
                  />
                )
              } else if (item.isGroup && item.items) {
                return (
                  <ItemGroup
                    key={item.name + 'group'}
                    items={item.items}
                    setItemsArr={setItemsArr}
                  />
                )
              }
            })}
          </AnimatePresence>
        </>
      ) : (
        <p>No items yet</p>
      )}
    </Container>
  )
}

export default Category
