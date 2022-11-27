// const { Prisma } = require('@prisma/client')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { faker } = require(`@faker-js/faker`)

const items = []

const userId = faker.datatype.uuid()

for (let i = 0; i < 150; i++) {
  items.push({
    name: faker.commerce.product(),
    id: faker.datatype.uuid(),
    dateAdded: faker.date.past(),
    userId: `1`,
    categoryId: faker.datatype.number({ min: 1, max: 3 }).toString(),
    price: faker.commerce.price(50, 1000),
    link: faker.internet.url(),
  })
}

const users = [
  {
    id: `1`,
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    salary: faker.datatype.number({ min: 30000, max: 200000 }),
  },
]

const categories = [
  {
    id: `1`,
    name: `Tech`,
    categoryType: `WISHLIST`,
    userId: `1`,
  },
  {
    id: `2`,
    name: `Life`,
    categoryType: `WISHLIST`,
    userId: `1`,
  },
  {
    id: `3`,
    name: `Clothes`,
    categoryType: `WISHLIST`,
    userId: `1`,
  },
]

// const subItems = [
//    {
//     name: 'Macbook Pro',
//     id: '786789978',
//     link: 'https://www.apple.com/macbook-pro/',
//     dateAdded: new Date(),
//     userId: '1',
//     categoryId: '1',
//     price: new Prisma.Decimal(2499.99),
//     group: 'laptop',
//     itemId: '1',
//   },
//   {
//     name: 'Macbook Air',
//     id: '28934u829',
//     link: 'https://www.apple.com/macbook-air/',
//     dateAdded: new Date(),
//     userId: '1',
//     categoryId: '1',
//     price: new Prisma.Decimal(1999.99),
//     group: 'laptop',
//     itemId: '1',
//   }, {
//     name: 'HP Spectre x360',
//     id: '29840fdaskj',
//     link: 'https://www.hp.com/us/en/laptops/spectre-x360/',
//     dateAdded: new Date(),
//     userId: '1',
//     categoryId: '1',
//     price: new Prisma.Decimal(1999.99),
//     group: 'laptop',
//     itemId: '1',
//   },
// ]

module.exports = {
  items,
  categories,
  users,
}
