export const fetcher = (...args: any) =>
  fetch(...([args] as const)).then((res) => res.json())
