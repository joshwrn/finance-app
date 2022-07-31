import prisma from '@lib/prisma'

export default async function handler(req: any, res: any) {
  if (req.method === `POST`) {
    const item = req.body
    console.log(item)

    try {
      const data = await prisma.item.create({
        data: item,
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
