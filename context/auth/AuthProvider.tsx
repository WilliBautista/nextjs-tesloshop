import { FC, useReducer, useEffect } from 'react'

import { useSession, signOut } from 'next-auth/react'

import Cookie from 'js-cookie'
import axios from 'axios'

import { AuthContext, authReducer } from './'
import { tesloApi } from '../../api'
import { IUser } from '../../interfaces'

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;

}

const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined
}

interface Props {
  children: JSX.Element | JSX.Element[]
}

export const AuthProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE)
  const { data, status } = useSession()

  useEffect(() => {
    if ( status === 'authenticated' ) {
      dispatch({ type: 'Auth - Login', payload: data?.user as IUser })
    }
  }, [status, data])


  //* Custom authentication
  // useEffect(() => {
  //   checkToken()
  // }, [])

  const checkToken = async () => {

    if ( !Cookie.get('token') ) return

    try {
      const { data } = await tesloApi.get('/user/validate-token')
      const { token, user } = data
      Cookie.set('token', token)
      dispatch({ type: 'Auth - Login', payload: user })
    } catch (error) {
      Cookie.remove('token')
    }
  }

  const loginUser = async ( email: string, password: string ): Promise<boolean> => {
    try {
      const { data } = await tesloApi.post('/user/login', { email, password })
      const { token, user } = data
      Cookie.set('token', token)
      dispatch({ type: 'Auth - Login', payload: user })
      return true
    } catch (error) {
      return false
    }
  }

  const registerUser = async ( name: string, email: string, password: string ): Promise<{hasError: boolean; message?: string}> => {
    try {
      const { data } = await tesloApi.post('/user/register', { name, email, password })
      const { token, user } = data
      Cookie.set('token', token)
      dispatch({ type: 'Auth - Login', payload: user })

      return {
        hasError: false,
      }
    } catch (error) {
      if ( axios.isAxiosError(error) ) {
        return {
          hasError: true,
          message: error.message
        }
      }

      return {
        hasError: true,
        message: 'Error creating user'
      }
    }
  }

  const logoutUser = () => {
    //* Custom authentication
    // router.reload()
    // Cookie.remove('token')

    signOut()
    Cookie.remove('cart')
    Cookie.remove('address')
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,

        // Methods
        logoutUser,
        loginUser,
        registerUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
