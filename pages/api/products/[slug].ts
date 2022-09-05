import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { Product } from '../../../Models'
import { IProduct } from '../../../interfaces';

type Data =
  | { message: string }
  | IProduct

export default function handler ( req: NextApiRequest, res: NextApiResponse<Data> ) {

  switch ( req.method ) {
    case 'GET':
      return getProduct( req, res )

    default:
      return res.status(400).json({
        message: 'Bad request'
      })
  }
}

const getProduct = async ( req: NextApiRequest, res: NextApiResponse ) => {
  const { slug } = req.query

  await db.connect()
  const product = await Product.findOne({ slug }).lean()
  await db.disconnect()

  if ( !product ) {
    return res.status(404).json({
      message: 'Page not exist'
    })
  }

  product.images = product.images.map( img => img.includes('http') ? img : `${process.env.HOST_NAME}products/${ img }`)

  return res.status(200).json( product )
}
