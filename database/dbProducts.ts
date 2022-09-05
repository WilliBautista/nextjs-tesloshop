import { db } from './'
import { Product } from '../Models'
import { IProduct } from '../interfaces';

interface ProductSlug {
  slug: string
}

export const getAllProducts = async (): Promise<IProduct[]> => {
  await db.connect()
  const products = await Product
    .find()
    .select('title images price inStock slug -_id')
    .lean()
  await db.disconnect()

  const updatedProducts = products.map(product => {
    product.images = product.images.map( img => img.includes('http') ? img : `${process.env.HOST_NAME}products/${ img }`)
    return product
  })

  return JSON.parse( JSON.stringify( updatedProducts ) )
}

export const getProductBySlug = async ( slug: string ): Promise<IProduct|null> => {
  await db.connect()
  const product = await Product.findOne({ slug }).lean()
  await db.disconnect()

  if ( !product ) return null

  product.images = product.images.map( img => img.includes('http') ? img : `${process.env.HOST_NAME}products/${ img }`)

  return JSON.parse( JSON.stringify( product ) )
}

export const getAllProductSlugs = async (): Promise<ProductSlug[]> => {
  await db.connect()
  const slugs = await Product.find().select('slug -_id').lean()
  await db.disconnect()
  return slugs
}

export const getProductsByTerm = async ( term: string ): Promise<IProduct[]> => {

  term = term.toString().toLowerCase()

  await db.connect()

  const products = await Product.find({
    $text: { $search: term }
  })
  .select('title images price inStock slug -_id')
  .lean()

  await db.disconnect()

  const updatedProducts = products.map(product => {
    product.images = product.images.map( img => img.includes('http') ? img : `${process.env.HOST_NAME}products/${ img }`)
    return product
  })

  return updatedProducts
}
