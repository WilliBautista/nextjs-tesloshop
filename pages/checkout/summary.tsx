import { useContext, useEffect, useState } from 'react';

import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { Typography, Grid, Card, CardContent, Divider, Box, Button, Link, Chip } from '@mui/material'
import Cookie from 'js-cookie'

import { CartContext } from '../../context'
import { ShippingAddress } from '../../interfaces'
import { CartList, OrderSummary } from '../../components/cart'
import { ShopLayout } from '../../components/layouts'
import { countries } from '../../utils'

export const SummaryPage = () => {

  const router = useRouter()
  const { shippingAddress, numberOfItems, createOrder } = useContext( CartContext )
  const [isPosting, setIsPosting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if ( !Cookie.get('address') ) router.push('/checkout/address')
  }, [router])

  const onCreateOrder = async () => {
    setIsPosting(true)
    const { hasError, message } = await createOrder()

    if ( hasError ) {
      setIsPosting( false )
      setErrorMessage( message )
      return
    }

    router.replace(`/orders/${ message }`)
  }

  if ( !shippingAddress ) return <></>

  const { firstName, lastName = '', address, secondAddress = '', zip, country, city, phone  } = shippingAddress as ShippingAddress

  return (
    <ShopLayout metatitle='Order summary' metadescription='Order summary'>
      <Typography variant='h1' component='h1'>Order summary</Typography>
      <Grid container>
        <Grid item sm={ 7 }>
          <CartList />
        </Grid>
        <Grid item sm={ 5 }>
          <Card className='summary-card'>
            <CardContent>
              <Typography variant='h2'>Summary ({ numberOfItems } { numberOfItems > 1 ? 'products' : 'product' })</Typography>
              <Divider sx={{ my: 1 }} />

              <Box display='flex' justifyContent='space-between'>
                <Typography variant='subtitle1'>Delivery address</Typography>
                <NextLink href='/checkout/address' passHref>
                  <Link underline='always'>
                    Edit
                  </Link>
                </NextLink>
              </Box>

              <Typography>{ `${ firstName } ${ lastName }` }</Typography>
              <Typography>{ address }</Typography>
              {
                secondAddress && <Typography>{ secondAddress }</Typography>
              }
              <Typography>{ `${ city }, ${ zip }` }</Typography>
              <Typography>{ countries.find(c => c.code === country)?.name }</Typography>
              <Typography>{ phone }</Typography>

              <Divider sx={{ my: 1 }} />

              <Box display='flex' justifyContent='end'>
                <NextLink href='/cart' passHref>
                  <Link underline='always'>
                    Edit
                  </Link>
                </NextLink>
              </Box>

              <OrderSummary />

              <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                <Button
                  fullWidth
                  color='secondary'
                  className='circular-btn'
                  onClick={ onCreateOrder }
                  disabled={ isPosting }
                >
                  Confirm order
                </Button>
                <Chip
                  color='error'
                  label={ errorMessage }
                  sx={{ display: errorMessage ? 'flex' : 'none', mt: 2 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export default SummaryPage
