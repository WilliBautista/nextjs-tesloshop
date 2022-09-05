import { useContext, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { FormControl, Grid, Box, MenuItem, TextField, Typography, Button } from '@mui/material'
import { useForm, SubmitHandler  } from 'react-hook-form'
import Cookie from 'js-cookie'

import { ShippingAddress } from '../../interfaces';
import { CartContext } from '../../context';
import { countries } from '../../utils'
import { ShopLayout } from '../../components/layouts'

export const AddressPage = () => {

  const getAddressFromCookies = (): ShippingAddress => {
    return Cookie.get('address')
      ? JSON.parse(Cookie.get('address')!)
      : {
        firstName: '',
        lastName: '',
        address: '',
        secondAddress: '',
        zip: '',
        city: '',
        country: '',
        phone: '',
      }
  }

  const router = useRouter()
  const { updateAddress } = useContext( CartContext )
  const [ defaultCountry, setDefaultCountry ] = useState('')
  const { register, handleSubmit, formState:{ errors }, reset } = useForm<ShippingAddress>({
    defaultValues: getAddressFromCookies()
  })

  useEffect(() => {
    const address = getAddressFromCookies()
    reset(address)
    setDefaultCountry(address.country)
  }, [reset])


  const onSubmitAddress: SubmitHandler<ShippingAddress> = ( formData: ShippingAddress ) => {
    updateAddress(formData)
    router.push('/checkout/summary')
  }

  return (
    <ShopLayout
      metatitle='Adress'
      metadescription='Confirm destination address'
    >
      <Typography variant='h1' component='h1'>Shipping address</Typography>
      <form onSubmit={ handleSubmit(onSubmitAddress) }>
        <Grid container spacing={ 2 } sx={{ mt: 2 }}>
          <Grid item xs={12} sm={ 6 }>
            <TextField
            label='First Name'
            variant='filled'
            fullWidth
            { ...register('firstName', {
              required: 'First Name is required',
              minLength: {
                value: 2,
                message: 'First Name must be greater than 2'
              },
              pattern: {
                value: /^[A-Za-z\s]+$/i,
                message: 'Invalid First NamE value'
              }
            })}
            error={ !!errors.firstName }
            helperText={ errors.firstName?.message }
            />
          </Grid>
          <Grid item xs={12} sm={ 6 }>
            <TextField
              label='Last Name'
              variant='filled'
              fullWidth
              { ...register('lastName', {
                required: false,
                minLength: {
                  value: 2,
                  message: 'Last Name must be greater than 2'
                },
                pattern: {
                  value: /^[A-Za-z\s]+$/i,
                  message: 'Invalid Last Name value'
                }
              })}
              error={ !!errors.lastName }
              helperText={ errors.lastName?.message }
            />
          </Grid>
          <Grid item xs={12} sm={ 6 }>
            <TextField
            label='Address'
            variant='filled'
            fullWidth
            { ...register('address', {
              required: 'Address is required',
            })}
            error={ !!errors.address }
            helperText={ errors.address?.message }
          />
          </Grid>
          <Grid item xs={12} sm={ 6 }>
            <TextField
            label='Second Address (optional)'
            variant='filled'
            fullWidth
            { ...register('secondAddress') }
          />
          </Grid>
          <Grid item xs={12} sm={ 6 }>
            <TextField
            label='Postal code'
            variant='filled'
            fullWidth
            { ...register('zip', {
              required: 'Postal code is required',
            })}
            error={ !!errors.zip }
            helperText={ errors.zip?.message }
          />
          </Grid>
          <Grid item xs={12} sm={ 6 }>
            <TextField
            label='City'
            variant='filled'
            fullWidth
            { ...register('city', {
              required: 'City is required',
            })}
            error={ !!errors.city }
            helperText={ errors.city?.message }
          />
          </Grid>
          <Grid item xs={12} sm={ 6 }>
            <FormControl fullWidth>
              <TextField
                key={defaultCountry}
                select
                label='Country'
                variant='filled'
                fullWidth
                defaultValue={defaultCountry}
                {...register('country', {
                  required: 'Country is required',
                })}
                error={ !!errors.country }
                helperText={ errors.country?.message }
                >
                {
                  countries.map(country => (
                    <MenuItem key={country.code} value={country.code}>{ country.name }</MenuItem>
                  ))
                }
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={ 6 }>
            <TextField
              label='Phone number'
              variant='filled'
              fullWidth
              { ...register('phone', {
                required: 'Phone Number is required',
              })}
              error={ !!errors.phone }
              helperText={ errors.phone?.message }
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 5 }} display='flex' justifyContent='center'>
          <Button
            type='submit'
            color='secondary'
            className='circular-btn'
            size='large'
          >
            Review order
          </Button>
        </Box>
      </form>
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
// Se validación del token se debe hacer desde el lado del servidor por medio de un meddleware
// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
//   const { token = '' } = req.cookies
//   let isValidToken = false

//   try {
//     await jwt.isValidToken(token)
//     isValidToken = true
//   } catch (error) {
//     isValidToken = false
//   }

//   if ( !isValidToken ) {
//     return {
//       redirect: {
//         destination: '/auth/login?destination=/checkout/address',
//         permanent: false
//       }
//     }
//   }

//   return {
//     props: {}
//   }
// }

export default AddressPage
