import { atom } from 'recoil'

export const currentHoverState = atom<string | null>({
  key: `currentHoverState`,
  default: null,
})
export const currentDragState = atom<{ id: string | null; type: string | null }>(
  {
    key: `currentItemState`,
    default: { id: null, type: null },
  },
)
