import type { z } from 'zod'

export type Properties<Input> = Required<{
  [K in keyof Input]: z.ZodType<Input[K], any, Input[K]>
}>
