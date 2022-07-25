import { Decimal } from '@prisma/client/runtime'

export const numberToCurrency = (
  num: number | Decimal | string | undefined
): string => {
  if (num === undefined) {
    return `$-`
  }
  return Intl.NumberFormat(`en-US`, {
    style: `currency`,
    currency: `USD`,
  }).format(Number(num))
}

export const filterHost = (url: string | undefined | null) => {
  if (!url) return `-`
  const host = new URL(url).host
  const remove = host.replace(/^www\./, '')
  const index = remove.indexOf('.')
  return remove.substring(0, index)
}

export const convertDate = (date: string | Date) => {
  const dateObj = new Date(date)
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
