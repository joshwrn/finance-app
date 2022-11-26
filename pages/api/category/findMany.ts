import prisma from '@lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === `GET`) {
    try {
      const categories = await prisma.category.findMany({
        where: {
          AND: [
            { categoryType: `WISHLIST` },
            { userId: req.query.userId?.toString() },
          ],
        },
        include: { items: true },
      })
      return res.status(200).json({ categories })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ msg: `Something went wrong` })
    }
  } else {
    return res.status(405).json({ msg: `Method not allowed` })
  }
}
