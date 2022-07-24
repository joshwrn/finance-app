const { Prisma } = require('@prisma/client')

const users = [
  {
    id: '1',
    username: 'test',
    email: 'test@fake.com',
    password: 'test',
    salary: 50000,
  },
]

const categories = [
  {
    id: '1',
    name: 'Tech',
    categoryType: 'WISHLIST',
    userId: '1',
  },
  {
    id: '2',
    name: 'Life',
    categoryType: 'WISHLIST',
    userId: '1',
  },
  {
    id: '3',
    name: 'Clothes',
    categoryType: 'WISHLIST',
    userId: '1',
  },
]

const items = [
  {
    name: 'Macbook Pro',
    id: '1',
    link: 'https://www.apple.com/macbook-pro/',
    dateAdded: new Date(),
    userId: '1',
    categoryId: '1',
    price: new Prisma.Decimal(2499.99),
  },
]

module.exports = {
  items,
  categories,
  users,
}
