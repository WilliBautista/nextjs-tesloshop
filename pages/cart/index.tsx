import { useContext, useEffect } from 'react';

import { Typography, Grid, Card, CardContent, Divider, Box, Button } from '@mui/material';

import { CartContext } from '../../context';
import { ShopLayout } from "../../components/layouts"
import { CartList, OrderSummary } from '../../components/cart';
import { useRouter } from 'next/router';

export const CartPage = () => {

  const { numberOfItems } = useContext( CartContext )
  const router = useRouter()

  useEffect(() => {
    if ( !numberOfItems ) router.replace('/cart/empty')
  }, [numberOfItems, router])

  if ( !numberOfItems ) return <></>

  return (
    <ShopLayout metatitle='Cart - 1' metadescription='Shop cart'>
      <Typography variant='h1' component='h1'>Cart</Typography>
      <Grid container>
        <Grid item sm={ 7 }>
          <CartList editable />
        </Grid>
        <Grid item sm={ 5 }>
          <Card className='summary-card'>
            <CardContent>
              <Typography variant='h2'>Order</Typography>
              <Divider sx={{ mt: 1 }} />
              <OrderSummary />
              <Box sx={{ mt: 3 }}>
                <Button fullWidth color='secondary' className='circular-btn' onClick={ () => router.push('/checkout/address') }>
                  Checkout
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export default CartPage
