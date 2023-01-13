import type { FC } from 'react'
import React from 'react'

import { useOutsideClick } from '@hooks/useOutsideClick'
import type { ItemWithSubItems } from '@lib/zod/item'
import { anchorPointState } from '@state/drag'
import type { Entities } from '@state/entities'
import { useDeleteCategoryMutation } from '@state/entities/category'
import { useDeleteItemMutation } from '@state/entities/item'
import {
  atom,
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil'
import styled from 'styled-components'

import type { CategoryWithItems } from '~/prisma/prismaTypes'

import { itemModalState } from './Item/ItemModal'

export const contextMenuState = atom<{
  type: Entities | null
  item?: ItemWithSubItems | null
  category?: CategoryWithItems | null
  show: boolean
}>({
  key: `contextMenu`,
  default: {
    type: null,
    item: null,
    show: false,
    category: null,
  },
})

const ItemOptions: FC = () => {
  const setItemModal = useSetRecoilState(itemModalState)
  const [contextMenu, setContextMenu] = useRecoilState(contextMenuState)
  const resetAnchorPoint = useResetRecoilState(anchorPointState)
  const deleteItem = useDeleteItemMutation()
  const reset = () => {
    resetAnchorPoint()
    setContextMenu((prev) => ({
      ...prev,
      show: false,
    }))
  }
  return (
    <>
      <ListItem
        onClick={() => (
          setItemModal((prev) => ({
            ...prev,
            isOpen: true,
            mode: `createSubItem`,
          })),
          reset()
        )}
      >
        Add Subitem
      </ListItem>
      <ListItem
        onClick={() => (
          setItemModal((prev) => ({
            ...prev,
            isOpen: true,
            mode: `edit`,
          })),
          reset()
        )}
      >
        Edit
      </ListItem>
      <ListItem
        onClick={() => (
          deleteItem.mutate({
            id: contextMenu.item?.id ?? ``,
            categoryId: contextMenu.item?.categoryId ?? ``,
          }),
          reset()
        )}
      >
        Delete
      </ListItem>
    </>
  )
}

const CategoryOptions: FC = () => {
  const resetAnchorPoint = useResetRecoilState(anchorPointState)
  const [contextMenu, setContextMenu] = useRecoilState(contextMenuState)
  const deleteCategory = useDeleteCategoryMutation()
  const reset = () => {
    resetAnchorPoint()
    setContextMenu((prev) => ({
      ...prev,
      show: false,
    }))
  }
  return (
    <ListItem
      onClick={() => (
        deleteCategory.mutate({
          id: contextMenu.category?.id ?? ``,
        }),
        reset()
      )}
    >
      Delete
    </ListItem>
  )
}

export const ContextMenu: FC = () => {
  const [anchorPoint, setAnchorPoint] = useRecoilState(anchorPointState)
  const contextMenu = useRecoilValue(contextMenuState)
  const resetContextMenu = useResetRecoilState(contextMenuState)
  const ref = useOutsideClick(
    () => (setAnchorPoint({ x: null, y: null }), resetContextMenu()),
  )

  return (
    <>
      {contextMenu.show && (
        <Menu
          style={{
            top: anchorPoint.y ?? 0,
            left: anchorPoint.x ?? 0,
          }}
          ref={ref}
        >
          {contextMenu.type === `item` && contextMenu.item?.id && (
            <ItemOptions />
          )}
          {contextMenu.type === `category` && contextMenu.category?.id && (
            <CategoryOptions />
          )}
        </Menu>
      )}
    </>
  )
}

const Menu = styled.div`
  font-size: 14px;
  background-color: var(--bg-item);
  padding: 6px 10px;
  width: 150px;
  height: auto;
  position: absolute;
  list-style: none;
  z-index: 999999;
  color: var(--fc-primary);
  backdrop-filter: blur(20px);
  border: 1px solid var(--color-white-20);
  border-radius: 10px;
`
const ListItem = styled.li`
  cursor: pointer;
  color: var(--fc-secondary);
  padding: 3px 5px;
  border-radius: 5px;
  :hover {
    color: var(--fc-primary);
    background-color: var(--bg-item);
  }
`
