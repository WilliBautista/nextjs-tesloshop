import { GetServerSideProps, NextPage } from 'next'

import { Typography, Grid, Card, CardContent, Divider, Chip, Box } from '@mui/material'
import { AirplaneTicketOutlined, CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material'

import { IOrder, ShippingAddress } from '../../../interfaces'
import { countries } from '../../../utils'
import { dbOrders } from '../../../database'
import { CartList, OrderSummary } from '../../../components/cart'
import { AdminLayout } from '../../../components/layouts';

interface Props {
  order: IOrder
}

export const OrderPage: NextPage<Props> = ({ order }) => {
  const { firstName, lastName = '', address, secondAddress = '', zip, country, city, phone  } = order.shippingAddress as ShippingAddress

  return (
    <AdminLayout
      title={`Order summary`}
      subtitle={ `Order id: ${ order._id! }` }
      icon={ <AirplaneTicketOutlined /> }
    >
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
                <Box display='flex' flexDirection='column'>
                  {
                    order.isPaid
                      ? <Chip
                          sx={{ my: 2, flex: 1 }}
                          label='Order has already been paid'
                          variant='outlined'
                          color='success'
                          icon={ <CreditScoreOutlined /> }
                        />
                      : <Chip
                          sx={{ my: 2, flex: 1 }}
                          label='Pending peyment'
                          variant='outlined'
                          color='error'
                          icon={ <CreditCardOffOutlined /> }
                        />
                  }
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const { id = '' } = query
  const order = await dbOrders.getOrderById( id.toString() )

  if ( !order ) {
    return {
      redirect: {
        destination: '/admin/orders',
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
