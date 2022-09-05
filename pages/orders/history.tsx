import NextLink from 'next/link'
import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'

import { Typography, Grid, Chip, Link } from '@mui/material'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'

import { dbOrders } from '../../database'
import ShopLayout from '../../components/layouts/ShopLayout'
import { IOrder } from '../../interfaces/order'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 50 },
  { field: 'fullname', headerName: 'Fullname', width: 300 },
  {
    field: 'paid',
    headerName: 'Paid',
    description: 'Paid or not',
    width: 200,
    renderCell: ( params: GridValueGetterParams ) => {
      return (
        params.row.paid
          ? <Chip color='success' label='Paid' variant='outlined' />
          : <Chip color='error' label='unpaid' variant='outlined' />
      )
    }
  },
  {
    field: 'order',
    headerName: 'Order',
    width: 200,
    sortable: false,
    renderCell: ( params: GridValueGetterParams ) => {
      return (
        <NextLink href={`/orders/${ params.row.orderId }`} passHref>
          <Link underline='always'>
            Go to Order
          </Link>
        </NextLink>
      )
    }
  }

]

interface Props {
  orders: IOrder[]
}

export const HistoryPage:NextPage<Props> = ({ orders }) => {

  const rows = orders.map((order, index) => ({
    id: index + 1,
    paid: order.isPaid,
    fullname: `${ order.shippingAddress.firstName } ${ order.shippingAddress.lastName }`,
    orderId: order._id
  }))

  return (
    <ShopLayout
      metatitle='Order history'
      metadescription='Customer order history '
    >
      <Typography variant='h1' component='h1'>Orders history</Typography>
      <Grid container className='fadeIn' sx={{ mt: 2 }}>
        <Grid item xs={12} sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={ rows }
            columns={ columns }
            pageSize={ 10 }
            rowsPerPageOptions={ [10] }
          />
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session: any = await getSession({ req })

  if ( !session ) {
    return {
      redirect: {
        destination: '/auth/login?destination=/orders/history',
        permanent: false,
      }
    }
  }

  const orders = await dbOrders.getOrderByUser( session.user._id )

  return {
    props: {
      orders
    }
  }
}

export default HistoryPage
