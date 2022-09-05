import { NextPage } from 'next'

import { ConfirmationNumberOutlined } from '@mui/icons-material'
import { Chip, Grid } from '@mui/material'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import useSWR from 'swr'

import { currency } from '../../../utils'
import { IUser, IOrder } from '../../../interfaces'
import { AdminLayout } from '../../../components/layouts'
import { FullScreenLoading } from '../../../components/ui'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Order ID', width: 250 },
  { field: 'email', headerName: 'Email', width: 250 },
  { field: 'name', headerName: 'Full Name', width: 300 },
  {
    field: 'total',
    headerName: 'Total',
    width: 150,
    renderCell: ({ row }: GridValueGetterParams) => {
      return currency.format(row.total)
    }
  },
  {
    field: 'isPaid',
    headerName: 'Pay',
    width: 100,
    renderCell: ({ row }: GridValueGetterParams) => {
      return row.isPaid
        ? <Chip variant='outlined' label='Pay' color='success'/>
        : <Chip variant='outlined' label='Pending' color='error'/>
    }
  },
  { field: 'noProducts', headerName: 'No Products', width: 150, align: 'center' },
  {
    field: 'check',
    headerName: 'Check order',
    width: 150,
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <a href={ `/admin/orders/${ row.id }` } target='_blank' rel='noreferrer'>
          Check order
        </a>
      )
    }
  },
  { field: 'createdAt', headerName: 'Created', width: 200 },
]

const OrdersPage: NextPage = () => {

  const { data, error } = useSWR<IOrder[]>('/api/admin/orders')

  if ( !data && !error ) return <FullScreenLoading />

  const rows = data!.map(order => ({
    id: order._id,
    email: (order.user as IUser).email,
    name: (order.user as IUser).name,
    total: order.total,
    isPaid: order.isPaid,
    noProducts: order.numberOfItems,
    createdAt: order.createdAt
  }))

  return (
    <AdminLayout
      title='Orders'
      subtitle='Manage orders'
      icon={ <ConfirmationNumberOutlined /> }
    >
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
    </AdminLayout>
  )
}

export default OrdersPage
