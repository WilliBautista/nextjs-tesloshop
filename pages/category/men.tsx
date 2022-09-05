import type { NextPage } from 'next'

import { Typography } from '@mui/material'

import useProducts from '../../hooks/useProducts';
import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products'
import { FullScreenLoading } from '../../components/ui'

const MenPage: NextPage = () => {

  const { products, isLoading } = useProducts('/products?gender=men')

  return (
    <ShopLayout
      metatitle='Teslo-Shop - Men category'
      metadescription='Find better products for men'
      imageFullUrl='...'
    >
      <Typography variant='h1' component='h1'>Tienda</Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>Category: Men</Typography>

      {
        isLoading
          ? <FullScreenLoading />
          : <ProductList products={ products }/>
      }
    </ShopLayout>
  )
}

export default MenPage
