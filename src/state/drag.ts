import { atom } from 'recoil'

export const currentHoverState = atom<string | null>({
  key: `currentHoverState`,
  default: ``,
})
export const currentItemState = atom<string | null>({
  key: `currentItemState`,
  default: ``,
})
