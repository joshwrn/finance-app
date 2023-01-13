import { atom } from 'recoil'

import type { Entities } from './entities'

export type HoverTypes = `category` | `move` | `trash`

export const DEFAULT_HOVER_STATE = {
  type: null as HoverTypes | null,
  id: null as string | null,
}

export const currentHoverState = atom<{
  type: HoverTypes | null
  id: string | null
}>({
  key: `currentHoverState`,
  default: DEFAULT_HOVER_STATE,
})
export const currentDragState = atom<{
  type: Entities | null
  id: string | null
}>({
  key: `currentItemState`,
  default: { id: null, type: null },
})

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
