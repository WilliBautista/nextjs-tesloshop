import { Grid, Typography } from '@mui/material'
import { AttachMoneyOutlined, CreditCardOffOutlined, DashboardOutlined, GroupOutlined, CategoryOutlined, CancelPresentationOutlined, ProductionQuantityLimitsOutlined, AccessTimeOutlined } from '@mui/icons-material';
import useSWR from 'swr';

import { DashboardSummaryResponse } from '../../interfaces';
import { AdminLayout } from '../../components/layouts'
import SummaryTitle from '../../components/admin/SummaryTitle'
import { FullScreenLoading } from '../../components/ui';
import { useState, useEffect } from 'react';

export const DashboardPage = () => {

  const { data, error } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
    refreshInterval: 30 * 1000,
  })

  const [ refreshIn, setRefreshIn ] = useState(30)

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshIn( refreshIn => refreshIn > 0 ? refreshIn - 1 : 30 )
    }, 1000)

    return () => clearInterval(interval)
  }, [])


  if ( !error && !data ) {
    return <FullScreenLoading />
  }

  if ( error ) {
    console.log(error);
    return <Typography>Error loading data</Typography>
  }

  const {
    numberOfOrders,
    paidOrder,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    productWithNoInventory,
    lowInventory,
  } = data!

  return (
    <AdminLayout
      title='Dashboard'
      subtitle='General metrics'
      icon={ <DashboardOutlined /> }
    >
      <Grid container spacing={2}>
        <SummaryTitle
          title={ numberOfOrders }
          subTitle='Total orders'
          icon={ <CreditCardOffOutlined color='secondary' sx={{ fontSize: 40 }} /> }
        />
        <SummaryTitle
          title={ paidOrder }
          subTitle='Paid orders'
          icon={ <AttachMoneyOutlined color='success' sx={{ fontSize: 40 }} /> }
        />
        <SummaryTitle
          title={ notPaidOrders }
          subTitle='Pending orders'
          icon={ <CreditCardOffOutlined color='error' sx={{ fontSize: 40 }} /> }
        />
        <SummaryTitle
          title={ numberOfClients }
          subTitle='Clients'
          icon={ <GroupOutlined color='inherit' sx={{ fontSize: 40 }} /> }
        />
        <SummaryTitle
          title={ numberOfProducts}
          subTitle='Products'
          icon={ <CategoryOutlined color='warning' sx={{ fontSize: 40 }} /> }
        />
        <SummaryTitle
          title={ productWithNoInventory }
          subTitle='Out of stock'
          icon={ <CancelPresentationOutlined color='error' sx={{ fontSize: 40 }} /> }
        />
        <SummaryTitle
          title={ lowInventory }
          subTitle='In stock'
          icon={ <ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40 }} /> }
        />
        <SummaryTitle
          title={ refreshIn }
          subTitle='Updating on:'
          icon={ <AccessTimeOutlined color='secondary' sx={{ fontSize: 40 }} /> }
        />
      </Grid>
    </AdminLayout>
  )
}

export default DashboardPage
