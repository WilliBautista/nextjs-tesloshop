import { useContext, FC } from 'react';

import { Grid, Typography } from "@mui/material"

import { CartContext } from '../../context'
import { currency } from '../../utils'

interface Props {
  orderValues?: {
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
  }
}

export const OrderSummary: FC<Props> = ({ orderValues }) => {

  const { numberOfItems, subTotal, total, tax } = useContext( CartContext )
  const summaryValues = orderValues ? orderValues : { numberOfItems, subTotal, total, tax }

  return (
    <Grid container>
      <Grid item xs={ 6 }>
        <Typography>No. Products</Typography>
      </Grid>
      <Grid item xs={ 6 } display='flex' justifyContent='end'>
        <Typography>{ summaryValues.numberOfItems } { summaryValues.numberOfItems > 0 ? 'items' : 'item' }</Typography>
      </Grid>

      <Grid item xs={ 6 }>
        <Typography>Subtotal</Typography>
      </Grid>
      <Grid item xs={ 6 } display='flex' justifyContent='end'>
        <Typography>{ currency.format( summaryValues.subTotal ) }</Typography>
      </Grid>

      <Grid item xs={ 6 }>
        <Typography>Taxes ({ Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100 }%) </Typography>
      </Grid>
      <Grid item xs={ 6 } display='flex' justifyContent='end'>
        <Typography>{ currency.format( summaryValues.tax ) }</Typography>
      </Grid>

      <Grid item xs={ 6 } sx={{ mt: 2 }}>
        <Typography variant='subtitle1'>Total</Typography>
      </Grid>
      <Grid item xs={ 6 } sx={{ mt: 2 }} display='flex' justifyContent='end'>
        <Typography>{ currency.format( summaryValues.total ) }</Typography>
      </Grid>

    </Grid>
  )
}

export default OrderSummary
