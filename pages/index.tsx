import type { NextPage } from 'next'

import { Typography } from '@mui/material'

import useProducts from '../hooks/useProducts';
import { ShopLayout } from '../components/layouts'
import { ProductList } from '../components/products'
import { FullScreenLoading } from '../components/ui'

const HomePage: NextPage = () => {
  const { products, isLoading } = useProducts('/products')

  return (
    <ShopLayout
      metatitle='Teslo-Shop - Home'
      metadescription='Find better Teslo products here'
      imageFullUrl='...'
    >
      <Typography variant='h1' component='h1'>Store</Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>All products</Typography>

      {
        isLoading
          ? <FullScreenLoading />
          : <ProductList products={ products }/>
      }
    </ShopLayout>
  )
}

export default HomePage
