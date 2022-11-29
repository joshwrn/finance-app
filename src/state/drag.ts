import { atom } from 'recoil'

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
export const currentDragState = atom<{ id: string | null; type: string | null }>(
  {
    key: `currentItemState`,
    default: { id: null, type: null },
  },
)
