import { FC, useMemo, useState } from 'react';

import NextLink from 'next/link';

import { Card, Grid, CardActionArea, CardMedia, Box, Typography, Link, Chip } from '@mui/material'

import { IProduct } from '../../interfaces';

interface Props {
  product: IProduct
}

export const ProductCard: FC<Props> = ({ product }) => {
  const { title, price, images, slug } = product

  const [isHovered, setIsHovered] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  const roductImage = useMemo(() => {
    return isHovered
      ? images[1]
      : images[0]
  }, [isHovered, images])

  return (
    <Grid
      item
      xs={ 6 }
      sm={ 4 }
      onMouseEnter={ () => setIsHovered(true) }
      onMouseLeave={ () => setIsHovered(false) }
    >
        <Card>
          <NextLink href={`/product/${ slug }`} passHref prefetch={ false }>
            <Link>
              <CardActionArea>
                {
                  product.inStock === 0 && (
                    <Chip
                      color='primary'
                      label='Out of stock'
                      sx={{ position: 'absolute', 'zIndex': 99, top: 10, left: 10 }}
                    />
                  )
                }
                <CardMedia
                  className='fadeIn'
                  component='img'
                  image={ roductImage }
                  alt={ title }
                  onLoad={ () => setIsImageLoaded(true) }
                />
              </CardActionArea>
            </Link>
          </NextLink>
        </Card>

        <Box sx={{ mr: 1, display: isImageLoaded ? 'block' : 'none' }} className='fadeIn'>
          <Typography fontWeight={ 700 }>{ title }</Typography>
          <Typography fontWeight={ 500 }>${ price }</Typography>
        </Box>
    </Grid>
  )
}

export default ProductCard
