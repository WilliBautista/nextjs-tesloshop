import type { NextPage } from 'next'

import { Typography } from '@mui/material'

import useProducts from '../../hooks/useProducts';
import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products'
import { FullScreenLoading } from '../../components/ui'

const WomenPage: NextPage = () => {

  const { products, isLoading } = useProducts('/products?gender=women')

  return (
    <ShopLayout
      metatitle='Teslo-Shop - Women category'
      metadescription='Find better products for women'
      imageFullUrl='...'
    >
      <Typography variant='h1' component='h1'>Tienda</Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>Category: Women</Typography>

      {
        isLoading
          ? <FullScreenLoading />
          : <ProductList products={ products }/>
      }
    </ShopLayout>
  )
}

export default WomenPage
