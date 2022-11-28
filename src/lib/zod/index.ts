import type { z, ZodTypeDef } from 'zod'

export type Properties<Input> = Required<{
  [K in keyof Input]: z.ZodType<Input[K], ZodTypeDef, Input[K]>
}>
