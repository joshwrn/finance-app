import { z } from 'zod'
import type {
  ZodTypeDef,
  ZodEffects,
  ZodLiteral,
  ZodOptional,
  ZodUnion,
} from 'zod'

export type Properties<Input> = Required<{
  [K in keyof Input]: z.ZodType<Input[K], ZodTypeDef, Input[K]>
}>

const emptyStringToUndefined = z.literal(``).transform(() => undefined)

export const asOptionalField = <T extends z.ZodTypeAny>(
  schema: T,
): ZodUnion<[ZodOptional<T>, ZodEffects<ZodLiteral<``>, undefined, ``>]> => {
  return schema.optional().or(emptyStringToUndefined)
}

export const VALID_URL =
  /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm
