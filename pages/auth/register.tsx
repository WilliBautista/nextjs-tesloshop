import { useForm  } from 'react-hook-form'

import { GetServerSideProps } from 'next';
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { signIn, getSession } from 'next-auth/react';

import { Grid, TextField, Typography, Box, Button, Link, Chip } from '@mui/material'
import { ErrorOutline } from '@mui/icons-material'

import { validations } from '../../utils'
import AuthLayout from '../../components/layouts/AuthLayout'
import { useState, useContext } from 'react'
import { AuthContext } from '../../context/auth/AuthContext'

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegisterPage = () => {
  const router = useRouter()
  const destination = router.query.destination?.toString() || '/'
  const { registerUser } = useContext( AuthContext )
  const { register, handleSubmit, watch, formState: { errors }  } = useForm<FormData>()
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const onRegisterForm = async ( { name, email, password }: FormData ) => {
    setShowError(false)

    const { hasError, message } = await registerUser(name, email, password)

    if ( hasError ) {
      setShowError(true)
      setErrorMessage( message || '' )
      setTimeout(() => setShowError(false), 3000)
      return
    }

    //* Custom authentication
    // router.replace(destination)

    await signIn('credentials', { name, email, password })
  }

  return (
    <AuthLayout metatitle='Login'>
      <form onSubmit={ handleSubmit( onRegisterForm ) } noValidate={true}>
        <Box sx={{ width: 350, padding: '10px 20px'}}>
          <Grid container spacing={ 2 }>
            <Grid item>
              <Typography variant='h1' component='h1'>New account</Typography>
              <Chip
                label={errorMessage}
                color='error'
                className='fadeIn'
                icon={ <ErrorOutline /> }
                sx={{ display: showError ? 'flex' : 'none' }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label='Name'
                variant='filled'
                fullWidth
                {...register('name', {
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be greater than 2'
                  },
                  pattern: {
                    value: /^[A-Za-z\s]+$/i,
                    message: 'Invalid name'
                  }
                })}
                error={ !!errors.name }
                helperText={ errors.name?.message }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type='email'
                label='Email'
                variant='filled'
                fullWidth
                { ...register('email', {
                  required: 'Email is required',
                  validate: validations.isEmail
                })}
                error={ !!errors.email }
                helperText={ errors.email?.message }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type='password'
                label='Password'
                variant='filled'
                fullWidth
                { ...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be greater than 6'
                  }
                })}
                error={ !!errors.password }
                helperText={ errors.password?.message }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Confirm Password'
                type='password'
                variant='filled'
                fullWidth
                { ...register('confirmPassword', {
                  required: 'Confirm Password is required',
                  validate: ( val: string ) => {
                    if ( watch('password') != val ) {
                      return 'Your password do not match'
                    }
                  }
                }) }
                error={ !!errors.confirmPassword }
                helperText={ errors.confirmPassword?.message }
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type='submit'
                color='secondary'
                className='circular-btn'
                size='large'
                fullWidth
              >
                Create
              </Button>
            </Grid>
            <Grid item xs={12} display='flex' justifyContent='end'>
              <NextLink href={`/auth/login?destination=${ destination }`} passHref>
                <Link underline='always'>
                  Login
                </Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const session = await getSession({ req })
  const { destination = '/' } = query

  if ( session ) {
    return {
      redirect: {
        destination: destination.toString(),
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}

export default RegisterPage
