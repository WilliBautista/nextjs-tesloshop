import { useState } from 'react'

import { useRouter } from 'next/router'
import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'

import { Typography, Grid, Card, CardContent, Divider, Box, Link, Chip, CircularProgress } from '@mui/material'
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material'
import { PayPalButtons } from '@paypal/react-paypal-js'

import { IOrder, ShippingAddress } from '../../interfaces'
import tesloApi from '../../api/tesloApi'
import { countries } from '../../utils'
import { dbOrders } from '../../database'
import { CartList, OrderSummary } from '../../components/cart'
import { ShopLayout } from '../../components/layouts'

export type OrderResponseBody = {
  id: string;
  status:
      | "COMPLETED"
      | "SAVED"
      | "APPROVED"
      | "VOIDED"
      | "COMPLETED"
      | "PAYER_ACTION_REQUIRED";
}

interface Props {
  order: IOrder
}

export const OrderPage: NextPage<Props> = ({ order }) => {
  const { firstName, lastName = '', address, secondAddress = '', zip, country, city, phone  } = order.shippingAddress as ShippingAddress

  const router = useRouter()
  const [ isPaying, setIsPaying ] = useState(false)

  const onOrderCompleted = async ( details: OrderResponseBody ) => {
    if ( details.status !== 'COMPLETED' ) {
      return alert('No paypal payment')
    }

    setIsPaying(true)

    try {

      const { data } = await tesloApi.post('/orders/pay', {
        transactionId: details.id,
        orderId: order._id
      })

      router.reload()

    } catch (error) {
      setIsPaying(false)
      console.log(error)
    }
  }

  return (
    <ShopLayout metatitle={`Order summary ${ order._id }`} metadescription='Order summary'>
      <Typography variant='h1' component='h1'>Order: { order._id }</Typography>

      {
        order.isPaid
          ? <Chip
              sx={{ my: 2 }}
              label='Order has already been paid'
              variant='outlined'
              color='success'
              icon={ <CreditScoreOutlined /> }
            />
          : <Chip
              sx={{ my: 2 }}
              label='Pending peyment'
              variant='outlined'
              color='error'
              icon={ <CreditCardOffOutlined /> }
            />
      }

      <Grid container className='fadeIn'>
        <Grid item sm={ 7 }>
          <CartList products={ order.orderItems }/>
        </Grid>
        <Grid item sm={ 5 }>
          <Card className='summary-card'>
            <CardContent>
              <Typography variant='h2'>Summary ({ order.numberOfItems } { order.numberOfItems > 1 ? 'products' : 'product' })</Typography>
              <Divider sx={{ my: 1}} />

              <Typography>{ `${ firstName } ${ lastName }` }</Typography>
              <Typography>{ address }</Typography>
              {
                secondAddress && <Typography>{ secondAddress }</Typography>
              }
              <Typography>{ `${ city }, ${ zip }` }</Typography>
              <Typography>{ countries.find(c => c.code === country)?.name }</Typography>
              <Typography>{ phone }</Typography>

              <Divider sx={{ my: 1}} />

              <OrderSummary orderValues={{
                numberOfItems: order.numberOfItems,
                subTotal: order.subTotal,
                tax: order.tax,
                total: order.total,
              }} />

              <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                <Box
                  display='flex'
                  justifyContent='center'
                  className='fadeIn'
                  sx={{ display: isPaying ? 'flex' : 'none' }}
                >
                  <CircularProgress />
                </Box>
                <Box sx={{ display: isPaying ? 'none' : 'flex', flex: 1 }} flexDirection='column'>
                  {
                    order.isPaid
                      ? <Chip
                          sx={{ my: 2 }}
                          label='Order has already been paid'
                          variant='outlined'
                          color='success'
                          icon={ <CreditScoreOutlined /> }
                        />
                      : <PayPalButtons
                          createOrder={(data, actions) => {
                            return actions.order.create({
                              purchase_units: [
                                {
                                  amount: {
                                    value: `${ order.total }`,
                                  },
                                },
                              ],
                            });
                          }}
                          onApprove={(data, actions) => {
                            return actions.order!.capture().then(onOrderCompleted);
                          }}
                        />
                  }
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const { id = '' } = query
  const session: any = await getSession({ req })

  if ( !session ) {
    return {
      redirect: {
        destination: `/auth/login?destination=/orders/${ id }`,
        permanent: false
      }
    }
  }

  const order = await dbOrders.getOrderById( id.toString() )

  if ( !order || order.user !== session.user._id ) {
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false
      }
    }
  }

  return {
    props: {
      order
    }
  }
}

export default OrderPage
