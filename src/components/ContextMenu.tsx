import type { FC } from 'react'
import React from 'react'

import { useOutsideClick } from '@hooks/useOutsideClick'
import type { Entities } from '@state/entities'
import { atom, useRecoilState } from 'recoil'
import styled from 'styled-components'

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
  id: string | null
}>({
  key: `contextMenu`,
  default: {
    type: null,
    id: null,
  },
})

const ItemOptions: FC<{ id: string }> = ({ id }) => {
  return (
    <>
      <ListItem>Add Subitem</ListItem>
      <ListItem>Edit</ListItem>
    </>
  )
}

export const ContextMenu: FC = () => {
  const [anchorPoint, setAnchorPoint] = useRecoilState(anchorPointState)
  const [contextMenu, setContextMenu] = useRecoilState(contextMenuState)
  const ref = useOutsideClick(
    () => (
      setAnchorPoint({ x: null, y: null }),
      setContextMenu({ type: null, id: null })
    ),
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
          {contextMenu.type === `item` && contextMenu.id && (
            <ItemOptions id={contextMenu.id} />
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
