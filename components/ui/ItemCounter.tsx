import { FC } from 'react';

import { Box, IconButton, Typography } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';

interface Props {
  currentValue: number;
  maxValue: number;
  onUpdateQuantity: ( quantity: number ) => void;
}

export const ItemCounter: FC<Props> = ({ currentValue, maxValue, onUpdateQuantity }) => {

  const addOrRemove = ( value: number ) => {
    if ( value === -1 ) {
      if ( currentValue === 1 ) return
      return onUpdateQuantity( currentValue - 1 )
    }

    if ( currentValue >= maxValue ) return
    return onUpdateQuantity( currentValue + 1 )
  }

  return (
    <Box display='flex' alignItems='center'>
      <IconButton
        onClick={ () => addOrRemove( -1 ) }
        disabled={ currentValue <= 1 }
      >
        <RemoveCircleOutline />
      </IconButton>
      <Typography sx={{ width: 40, textAlign: 'center' }}>{ currentValue }</Typography>
      <IconButton
        onClick={ () => addOrRemove( +1 ) }
        disabled={ currentValue >= maxValue  }
      >
        <AddCircleOutline />
      </IconButton>
    </Box>
  )
}

export default ItemCounter
