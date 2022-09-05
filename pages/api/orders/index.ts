import { getSession } from 'next-auth/react'
import type { NextApiRequest, NextApiResponse } from 'next'

import { db } from '../../../database'
import { IOrder } from '../../../interfaces'
import { Order, Product } from '../../../Models'

type Data =
  | { message: string }
  | IOrder

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {

  switch ( req.method ) {
    case 'POST':
      return createOrder( req, res )
    default:
      return res.status(400).json({
        message: 'Bad request'
      })
  }
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

  const { orderItems, total } = req.body as IOrder

  const session: any = await getSession({ req })

  if ( !session ) {
    return res.status(401).json({
      message: 'You must to be authenticated to do this'
    })
  }

  // Collectio with products
  const productsIds = orderItems.map( product => product._id  )

  await db.connect()

  const dbProducts = await Product.find({ _id: { $in: productsIds } })

  try {
    const subTotal = orderItems.reduce(( prev, current ) => {

      const dbProductPrice = dbProducts.find(prod => prod.id === current._id)?.price

      if ( !dbProductPrice ) {
        throw new Error('Check the cart again, product does not exist')
      }

      return (dbProductPrice * current.quantity) + prev
    }, 0)

    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0)
    const backendTotal = subTotal * ( taxRate + 1 )

    if ( total !== backendTotal ) {
      throw new Error('Purchase total does not match the amount ')
    }

    const userId = session.user._id
    const newOrder = new Order({ ...req.body, isPaid: false, user: userId })
    newOrder.total = Math.round( newOrder.total * 100 ) // redondeo de decimales
    await newOrder.save()
    await db.disconnect()
    return res.status(201).json( newOrder )

  } catch (error: any) {
    await db.disconnect()
    console.log(error)
    res.status(400).json({
      message: error.message || 'Take a look to server logs'
    })
  }

  return res.status(201).json( dbProducts as any )
}
