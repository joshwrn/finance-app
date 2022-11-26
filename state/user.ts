import type { User } from '@prisma/client'
import { atom } from 'recoil'

export const DEFAULT_USER: User = {
  id: ``,
  email: ``,
  emailVerified: null,
  name: ``,
  image: ``,
}

export const userState = atom({
  key: `userState`,
  default: DEFAULT_USER,
})
