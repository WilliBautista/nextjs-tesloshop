import { FC, useContext } from 'react'

import NextLink from 'next/link'
import { Typography, Grid, Link, CardActionArea, CardMedia, Box, Button } from '@mui/material'

import { ItemCounter } from '../ui'
import { CartContext } from '../../context/cart/CartContext'
import { ICartProduct, IOrderItem } from '../../interfaces'

interface Props {
  editable?: boolean;
  products?: IOrderItem[];
}

export const CartList: FC<Props> = ({ editable = false, products }) => {
  const { cart, updateCartQuantity, removeProductFromCart } = useContext( CartContext )

  const onNewCartQuantityValue = ( product: ICartProduct, newQuantityValue: number ) => {
    product.quantity = newQuantityValue
    updateCartQuantity( product )
  }

  const onRemoveProductFromCart = ( product: ICartProduct ) => {
    removeProductFromCart(product)
  }

  const productToShow = products ? products : cart

  return (
    <>
      {
        productToShow.map( product => (
          <Grid container spacing={ 2 } key={ product._id + product.size } sx={{ mb: 1 }}>
            <Grid item xs={3}>
              <NextLink href={`/product/${ product.slug }`} passHref>
                <Link>
                  <CardActionArea>
                    <CardMedia
                      image={ product.image }
                      component='img'
                      sx={{ borderRadius: '5px' }}
                    />
                  </CardActionArea>
                </Link>
              </NextLink>
            </Grid>
            <Grid item xs={7}>
              <Box display='flex' flexDirection='column'>
                <Typography variant='body1'>{ product.title }</Typography>
                <Typography variant='body1'>Size: <strong>{ product.size }</strong></Typography>
                {
                  editable
                    ? <ItemCounter
                        currentValue={ product.quantity }
                        maxValue={ 10 }
                        onUpdateQuantity={ newValue => onNewCartQuantityValue(product as ICartProduct, newValue) }
                      />
                    : <Typography variant='h5'>{ product.quantity } { product.quantity > 1 ? 'items' : 'item' } </Typography>
                }
              </Box>
            </Grid>
            <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
              <Typography variant='subtitle1'>${ product.price }</Typography>
              {
                editable && (
                  <Button
                    variant='text'
                    color='secondary'
                    onClick={ () => onRemoveProductFromCart(product as ICartProduct) }
                  >
                    Remove
                  </Button>
                )
              }
            </Grid>
          </Grid>
        ))
      }
    </>
  )
}

export default CartList
