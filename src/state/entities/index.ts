export type QueryKey<T> = (input: T) => [string[], { input: T; type: string }]

export type Entities = `category` | `item`
