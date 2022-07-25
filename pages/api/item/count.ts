import prisma from '@lib/prisma'

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    const categoryId = req.query.id
    try {
      const data = await prisma.item.count({
        where: {
          categoryId,
        },
      })
      return res.status(200).json({ data })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ msg: 'Something went wrong' })
    }
  } else {
    return res.status(405).json({ msg: 'Method not allowed' })
  }
}
