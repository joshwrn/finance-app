import prisma from '@lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === `POST`) {
    const { itemId } = req.body
    try {
      const data = await prisma.item.delete({
        where: {
          id: itemId,
        },
      })
      return res.status(200).json({ data })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ msg: `Something went wrong` })
    }
  } else {
    return res.status(405).json({ msg: `Method not allowed` })
  }
}