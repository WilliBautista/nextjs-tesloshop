import { NextPage } from 'next'
import NextLink from 'next/link'

import { AddOutlined, CategoryOutlined } from '@mui/icons-material'
import { CardMedia, Grid, Link, Box, Button } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import useSWR from 'swr'

import { AdminLayout } from '../../../components/layouts'
import { FullScreenLoading } from '../../../components/ui'
import { IProduct } from '../../../interfaces'
import { currency } from '../../../utils'

const columns: GridColDef[] = [
  {
    field: 'image',
    headerName: 'Picture',
    width: 100,
    renderCell: ({ row }: GridValueGetterParams) => (
      <a href={`/product/${ row.slug }`} target='_blank' rel='noreferrer'>
        <CardMedia
          component='img'
          alt={ row.title }
          className='fadeIn'
          image={`${ row.image }`}
        />
      </a>
    )
  },
  {
    field: 'title',
    headerName: 'Title',
    width: 300,
    renderCell: ({ row }: GridValueGetterParams) => (
      <NextLink href={`/admin/products/${ row.slug }`} passHref>
        <Link underline='always'>
          { row.title }
        </Link>
      </NextLink>
    )
  },
  { field: 'gender', headerName: 'Gender', align: 'center' },
  { field: 'type', headerName: 'Type', align: 'center' },
  { field: 'inStock', headerName: 'In stock', align: 'center' },
  { field: 'sizes', headerName: 'Sizes', width: 250, align: 'center' },
  {
    field: 'price',
    headerName: 'Price',
    align: 'center',
    renderCell: ({ row }: GridValueGetterParams) => currency.format( row.price )
  },
]

const ProductsPage: NextPage = () => {

  const { data, error } = useSWR<IProduct[]>('/api/admin/products')

  if ( !data && !error ) return <FullScreenLoading />

  const rows = data!.map(product => ({
    id: product._id,
    image: product.images[0],
    title: product.title,
    gender: product.gender,
    type: product.type,
    inStock: product.inStock,
    price: product.price,
    sizes: product.sizes.join(', '),
    slug: product.slug,
  }))

  return (
    <AdminLayout
      title={`Products (${ data?.length })`}
      subtitle='Manage products'
      icon={ <CategoryOutlined /> }
    >
      <Box display='flex' justifyContent='end' sx={{ mb: 2 }}>
        <Button
          startIcon={ <AddOutlined /> }
          color='secondary'
          href='/admin/products/new'
        >
          New product
        </Button>
      </Box>
      <Grid container className='fadeIn' sx={{ mt: 2 }}>
        <Grid item xs={12} sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={ rows }
            columns={ columns }
            pageSize={ 15 }
            rowsPerPageOptions={ [10] }
          />
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default ProductsPage
