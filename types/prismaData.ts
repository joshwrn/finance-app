export interface ItemType {
  id: string
  name: string
  price: string
  dateAdded: string
  datePurchased?: string
  link?: string
  category: string
  group?: string
  user: string
}

export interface CategoryType {
  id: string
  name: string
  items: ItemType[]
  type: string
}
