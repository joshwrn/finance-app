import type { FC } from 'react'
import React from 'react'

import { useOutsideClick } from '@hooks/useOutsideClick'
import type { ItemWithSubItems } from '@lib/zod/item'
import type { Entities } from '@state/entities'
import {
  atom,
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil'
import styled from 'styled-components'

import { createItemModalState } from '../pages/wishlist'

export const anchorPointState = atom<{
  x: number | null
  y: number | null
}>({
  key: `anchorPoint`,
  default: {
    x: null,
    y: null,
  },
})

export const contextMenuState = atom<{
  type: Entities | null
  item: ItemWithSubItems | null
}>({
  key: `contextMenu`,
  default: {
    type: null,
    item: null,
  },
})

const ItemOptions: FC = () => {
  const setIsOpen = useSetRecoilState(createItemModalState)
  const setAnchorPoint = useResetRecoilState(anchorPointState)
  return (
    <>
      <ListItem onClick={() => (setIsOpen(true), setAnchorPoint())}>
        Add Subitem
      </ListItem>
      <ListItem>Edit</ListItem>
    </>
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
      {anchorPoint.x !== null && anchorPoint.y !== null && (
        <Menu
          style={{
            top: anchorPoint.y,
            left: anchorPoint.x,
          }}
          ref={ref}
        >
          {contextMenu.type === `item` && contextMenu.item?.id && (
            <ItemOptions />
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
