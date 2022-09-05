import { RemoveShoppingCartOutlined } from '@mui/icons-material'
import { Box, Link, Typography } from '@mui/material'
import NextLink from 'next/link'

import { ShopLayout } from "../../components/layouts"

export const EmptyPage = () => {
  return (
    <ShopLayout
      metatitle="Empty Cart"
      metadescription="There are not items in the cart"
    >
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        height='calc(100vh - 200px)'
        sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
      >
        <RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
        <Box display='flex' alignItems='center' flexDirection='column'>
          <Typography>Your cart is empty</Typography>
          <NextLink href='/' passHref>
            <Link typography='h4' color='secondary'>
              Go back
            </Link>
          </NextLink>
        </Box>
      </Box>
    </ShopLayout>
  )
}

export default EmptyPage
