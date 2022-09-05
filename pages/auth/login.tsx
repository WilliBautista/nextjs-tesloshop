import { useState, useEffect } from 'react';

import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { getSession, signIn, getProviders } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { Grid, TextField, Typography, Box, Button, Link, Chip, Divider } from '@mui/material'
import { ErrorOutline } from '@mui/icons-material'

import { validations } from '../../utils'
import AuthLayout from '../../components/layouts/AuthLayout'

type FormData = {
  email: string;
  password: string;
}

export const LoginPage = () => {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
  const destination = router.query.destination?.toString() || '/'
  const [ showError, setShowError ] = useState(false)

  const [providers, setProviders] = useState<any>({})

  useEffect(() => {
    getProviders()
      .then(provs => {
        setProviders(provs)
      })
  }, [])


  const onLoginUser = async ( formData: FormData ) => {

    setShowError(false)
    await signIn('credentials', formData)

    //* Custom authentication
    // const isValidLoggin = await loginUser( formData.email, formData.password )
    // if ( !isValidLoggin ) {
    //   setShowError(true)
    //   setTimeout(() => setShowError(false), 3000)
    //   return
    // }
    // router.replace(destination)
  }

  return (
    <AuthLayout metatitle='Login'>
      <form onSubmit={ handleSubmit( onLoginUser ) } noValidate={true}>
        <Box sx={{ width: 350, padding: '10px 20px'}}>
          <Grid container spacing={ 2 }>
            <Grid item>
              <Typography variant='h1' component='h1'>Login</Typography>
              <Chip
                label='Incorrect email or password'
                color='error'
                icon={ <ErrorOutline /> }
                className='fadeIn'
                sx={{ display: showError ? 'flex' : 'none' }}
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
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Min length is 6'
                  }
                })}
                error={ !!errors.password }
                helperText={ errors.password?.message }
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type='submit'
                color='secondary'
                className='circular-btn'
                size='large'
                fullWidth>
                  Login
              </Button>
            </Grid>
            <Grid item xs={12} display='flex' justifyContent='end'>
              <NextLink href={ `/auth/register?destination=${ destination }` } passHref>
                <Link underline='always'>
                  Register
                </Link>
              </NextLink>
            </Grid>
            <Grid item xs={12} display='flex' flexDirection='column' justifyContent='end'>
              <Divider sx={{ width: '100%', mb: 2 }} />
              {
                Object.values(providers).map(( provider: any ) => {

                  if ( provider.id === 'credentials' )  return (<div key='credebtials'></div>)

                  return (
                    <Button
                      key={ provider.id }
                      variant='outlined'
                      fullWidth
                      color='primary'
                      sx={{ mb: 1 }}
                      onClick={ () => signIn( provider.id ) }
                    >
                      { provider.name }
                    </Button>
                  )
                })
              }
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

export default LoginPage
