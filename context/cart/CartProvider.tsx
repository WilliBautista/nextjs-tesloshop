import { FC, useReducer, useEffect } from 'react'

import Cookie from 'js-cookie'
import axios from 'axios'

import { tesloApi } from '../../api';
import { CartContext, cartReducer } from './'
import { ICartProduct, IOrder, ShippingAddress } from '../../interfaces'

export interface CartState {
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
  shippingAddress?: ShippingAddress;
}

const CART_INITIAL_STATE: CartState = {
  cart: [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
  shippingAddress: undefined,
};

interface Props {
  children: JSX.Element | JSX.Element[]
}

export const CartProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE)

  // Get cart from cookies
  useEffect(() => {
    const cookieCart = Cookie.get('cart') ? JSON.parse( Cookie.get('cart')! ) : []
    dispatch({ type: 'Cart - LoadCart from cookies | storage', payload: cookieCart })
  }, [])

  // Save and update cart cookie
  useEffect(() => {
    if ( state.cart.length > 0 ) Cookie.set('cart', JSON.stringify( state.cart ))
  }, [state.cart])

  // Load Address from cookies
  useEffect(() => {
    const cookieAddress = Cookie.get('address') && JSON.parse( Cookie.get('address')! )
    if ( cookieAddress ) dispatch({ type: 'Cart - Load Address from cookies', payload: cookieAddress })
  }, [])

  useEffect(() => {
    const numberOfItems = state.cart.reduce(( prev, current ) => current.quantity + prev, 0)
    const subTotal = state.cart.reduce(( prev, current ) => (current.price * current.quantity) + prev, 0)
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0)

    const orderSummary = {
      numberOfItems,
      subTotal,
      tax: subTotal * taxRate,
      total: subTotal * ( taxRate + 1 )
    }

    dispatch({ type: 'Cart - Update order summary', payload: orderSummary })

  }, [state.cart])

  const addProductToCart = ( product: ICartProduct ) => {

    const productInCart = state.cart.some( item => item._id === product._id )
    if ( !productInCart ) return dispatch({ type: 'Cart - Update Products in cart', payload: [...state.cart, product] })

    const productIncarButDifferentSize = state.cart.some( item => item._id === product._id && item.size === product.size )
    if ( !productIncarButDifferentSize ) return dispatch({ type: 'Cart - Update Products in cart', payload: [...state.cart, product] })

    // Acumular
    const updateProducts = state.cart.map( item => {
      if ( item._id !== product._id) return item
      if ( item.size !== product.size) return item

      // Update quantity
      item.quantity += product.quantity

      return item
    })

    dispatch({ type: 'Cart - Update Products in cart', payload: updateProducts })
  }

  const updateCartQuantity = ( product: ICartProduct ) => {
    dispatch({ type: 'Cart - Change cart quantity', payload: product })
  }

  const removeProductFromCart = ( product: ICartProduct ) => {
    dispatch({ type: 'Cart - Remove product from cart', payload: product })
    if ( state.cart.length === 1 ) Cookie.set('cart', JSON.stringify([]))
  }

  const updateAddress = ( shippingAddress: ShippingAddress ) => {
    Cookie.set('address', JSON.stringify( shippingAddress ))
    dispatch({ type: 'Cart - Load Address from cookies', payload: shippingAddress })
  }

  const createOrder = async (): Promise<{ hasError: boolean; message: string }> => {

    if ( !state.shippingAddress ) {
      throw new Error('No shipping address')
    }

    const body: IOrder = {
      orderItems: state.cart.map(product => ({
        ...product,
        size: product.size!
      })),
      shippingAddress: state.shippingAddress,
      numberOfItems: state.numberOfItems,
      subTotal: state.subTotal,
      tax: state.tax,
      total: state.total,
      isPaid: false,
    }

    try {
      const { data } = await tesloApi.post<IOrder>('/orders', body)

      dispatch({ type: 'Cart - Order complete' })
      Cookie.set('cart', JSON.stringify([]))

      return {
        hasError: false,
        message: data._id!
      }

    } catch (error) {
      console.log(error)

      if ( axios.isAxiosError(error) ) {
        return {
          hasError: false,
          message: error.message
        }
      }

      return {
        hasError: true,
        message: 'Contact the admin'
      }

    }
  }

  return (
    <CartContext.Provider
      value={{
        ...state,

        // Methods
        addProductToCart,
        updateCartQuantity,
        removeProductFromCart,
        updateAddress,
        createOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
