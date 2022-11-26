import prisma from '@lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === `GET`) {
    const { email } = req.query
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: email?.toString(),
        },
      })
      if (!user) {
        return res.status(404).json({ message: `User not found` })
      }
      return res.status(200).json({ user })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ msg: `Something went wrong` })
    }
  } else {
    return res.status(405).json({ msg: `Method not allowed` })
  }
}
