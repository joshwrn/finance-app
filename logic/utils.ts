export const numberToCurrency = (num: number | string | undefined): string => {
  if (num === undefined) {
    return `$-`
  }
  return Intl.NumberFormat(`en-US`, {
    style: `currency`,
    currency: `USD`,
  }).format(Number(num))
}

export const filterHost = (url: string) => {
  const host = new URL(url).host
  const remove = host.replace(/^www\./, '')
  const index = remove.indexOf('.')
  return remove.substring(0, index)
}

export const convertDate = (date: string) => {
  const dateObj = new Date(date)
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
