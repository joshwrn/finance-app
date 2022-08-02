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

const subItems = [
   {
    name: 'Macbook Pro',
    id: '786789978',
    link: 'https://www.apple.com/macbook-pro/',
    dateAdded: new Date(),
    userId: '1',
    categoryId: '1',
    price: new Prisma.Decimal(2499.99),
    group: 'laptop',
    itemId: '1',
  },
  {
    name: 'Macbook Air',
    id: '28934u829',
    link: 'https://www.apple.com/macbook-air/',
    dateAdded: new Date(),
    userId: '1',
    categoryId: '1',
    price: new Prisma.Decimal(1999.99),
    group: 'laptop',
    itemId: '1',
  }, {
    name: 'HP Spectre x360',
    id: '29840fdaskj',
    link: 'https://www.hp.com/us/en/laptops/spectre-x360/',
    dateAdded: new Date(),
    userId: '1',
    categoryId: '1',
    price: new Prisma.Decimal(1999.99),
    group: 'laptop',
    itemId: '1',
  },
]

const items = [
  {
    name: 'Laptop',
    id: '1',
    dateAdded: new Date(),
    userId: '1',
    categoryId: '1',
    group: true
  },
  {
    name: 'PS5',
    id: '2',
    link: 'https://www.sony.com/',
    dateAdded: new Date(),
    userId: '1',
    categoryId: '1',
    price: new Prisma.Decimal(699.99),
  },
  {
    name: 'iPad',
    id: '3',
    link: 'https://www.apple.com/macbook-pro/',
    dateAdded: new Date(),
    userId: '1',
    categoryId: '1',
    price: new Prisma.Decimal(999.99),
  },
]

module.exports = {
  items,
  categories,
  users,
}
