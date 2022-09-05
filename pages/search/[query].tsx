import type { NextPage, GetServerSideProps } from 'next'

import { Box, Typography, capitalize } from '@mui/material';

import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products'
import { dbProducts } from '../../database';
import { IProduct } from '../../interfaces/product'

interface Props {
  products: IProduct[],
  foundProducts: boolean;
  query: string;
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {

  return (
    <ShopLayout
      metatitle='Teslo-Shop - Search'
      metadescription='Find better Teslo products here'
      imageFullUrl='...'
    >
      <Typography variant='h1' component='h1'>Search product</Typography>

      {
        foundProducts
          ? <Typography variant='h2' sx={{ mb: 1 }} textTransform='capitalize'>Search: <strong>{ query }</strong></Typography>
          : (
            <Box display='flex'>
              <Typography variant='h2' sx={{ mb: 1 }}>No results by:</Typography>
              <Typography variant='h2' sx={{ mb: 1, ml: 1 }} color='secondary' textTransform='capitalize'><strong>{ query }</strong></Typography>
            </Box>
          )
      }

      <ProductList products={ products }/>
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { query = '' } = params as { query: string }

  if ( query.length === 0 ) {
    return {
      redirect: {
        destination: '/',
        permanent: true
      }
    }
  }

  let products = await dbProducts.getProductsByTerm( query )
  const foundProducts = products.length > 0

  if ( !foundProducts ) {
    products = await dbProducts.getAllProducts()
  }

  return {
    props: {
      products,
      foundProducts,
      query
    }
  }
}

export default SearchPage
