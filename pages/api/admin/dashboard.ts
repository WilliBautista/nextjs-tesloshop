import type { NextApiRequest, NextApiResponse } from 'next'

import { Order, Product, User } from '../../../Models';
import { db } from '../../../database';

type Data = {
  numberOfOrders: number;
  paidOrder: number; // isPaid true
  notPaidOrders: number;
  numberOfClients: number; // clients
  numberOfProducts: number;
  productWithNoInventory: number; // 0
  lowInventory: number; // Productos con menos de 10 artículos
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  await db.connect()

  const [
    numberOfOrders,
    paidOrder,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    productWithNoInventory,
    lowInventory,
  ] = await Promise.all([
    Order.count(),
    Order.find({ isPaid: true }).count(),
    Order.find({ isPaid: false }).count(),
    User.find({ role: 'client' }).count(),
    Product.count(),
    Product.find({ inStock: 0 }).count(),
    Product.find({ inStock: { $lte: 10 } }).count(),
  ])

  await db.disconnect()

  return res.status(200).json({
    numberOfOrders,
    paidOrder,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    productWithNoInventory,
    lowInventory,
  })
}
