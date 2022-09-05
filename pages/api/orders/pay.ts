import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';

import { IPaypal } from '../../../interfaces';
import { db } from '../../../database';
import { Order } from '../../../Models';

type Data = {
  message: string
}

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {

  switch ( req.method ) {
    case 'POST':
      return payOrder( req, res )

    default:
      return res.status(400).json({ message: 'Bad Request' })
  }
}

const getPaypalBearerToken = async (): Promise<string|null> => {
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const PAYPAL_SECRET_ID = process.env.PAYPAL_SECRET_ID

  const base64Token = Buffer.from(`${ PAYPAL_CLIENT_ID }:${ PAYPAL_SECRET_ID }`, 'utf-8').toString('base64')
  const body = new URLSearchParams('grant_type=client_credentials')

  try {

    const { data } = await axios.post(process.env.PAYPAL_OAUTH_URL || '', body, {
      headers: {
        'Authorization': `Basic ${ base64Token }`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    return data.access_token

  } catch (error) {
    if ( axios.isAxiosError(error) ) {
      console.log(error.response?.data)
    } else {
      console.log(error)
    }

    return null
  }
}

const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

  // TODO: Validar sesión del usuario
  // TODO: Validar mongo ID

  const paypalBearerToken = await getPaypalBearerToken()

  if ( !paypalBearerToken ) {
    return res.status(400).json({
      message: 'Token Paypal could not be confirmed'
    })
  }

  const { transactionId = '', orderId = '' } = req.body
  const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>(`${ process.env.PAYPAL_ORDERS_URL }/${ transactionId }`, {
    headers: {
      'Authorization': `Bearer ${ paypalBearerToken }`
    }
  })

  if ( data.status !== 'COMPLETED' ) {
    return res.status(401).json({ message: 'Unrecognized order' })
  }

  await db.connect()
  const dbOrder = await Order.findById(orderId)

  if ( !dbOrder ) {
    await db.disconnect()
    return res.status(400).json({ message: 'Order does not exist in database' })
  }

  if ( dbOrder.total !== Number(data.purchase_units[0].amount.value) ) {
    await db.disconnect()
    return res.status(400).json({ message: 'Amounts paypal on our orders are no similar' })
  }

  dbOrder.transactionId = transactionId
  dbOrder.isPaid = true
  dbOrder.save()

  db.disconnect()

  return res.status(200).json({ message: 'Order paid' })

}
