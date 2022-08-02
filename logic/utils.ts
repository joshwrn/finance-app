import type { Decimal } from '@prisma/client/runtime'

export const numberToCurrency = (
  num: Decimal | number | string | null | undefined,
): string => {
  if (!num) {
    return `$-`
  }
  return Intl.NumberFormat(`en-US`, {
    style: `currency`,
    currency: `USD`,
  }).format(Number(num))
}

export const filterHost = (url: string | null | undefined) => {
  if (!url) return `-`
  let host
  try {
    host = new URL(url).hostname
  } catch (err) {
    return url
  }
  const remove = host.replace(/^www\./, ``)
  const index = remove.indexOf(`.`)
  return remove.substring(0, index)
}

export const convertDate = (date: Date | string) => {
  const dateObj = new Date(date)
  return dateObj.toLocaleDateString(`en-US`, {
    month: `short`,
    day: `numeric`,
    year: `numeric`,
  })
}
