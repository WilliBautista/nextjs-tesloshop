import { CartState } from './';
import { ICartProduct, IOrderCartSummary, ShippingAddress } from '../../interfaces';

type CartActionType =
  | { type: 'Cart - LoadCart from cookies | storage', payload: ICartProduct[] }
  | { type: 'Cart - Update Products in cart', payload: ICartProduct[] }
  | { type: 'Cart - Change cart quantity', payload: ICartProduct }
  | { type: 'Cart - Remove product from cart', payload: ICartProduct }
  | { type: 'Cart - Update order summary', payload: IOrderCartSummary }
  | { type: 'Cart - Load Address from cookies', payload: ShippingAddress }
  | { type: 'Cart - Update address', payload: ShippingAddress }
  | { type: 'Cart - Order complete' }

export const cartReducer = ( state: CartState, action: CartActionType ): CartState => {
  switch (action.type) {
    case 'Cart - LoadCart from cookies | storage':
      return {
        ...state,
        cart: action.payload
      }

    case 'Cart - Update Products in cart':
      return {
        ...state,
        cart: [...action.payload]
      }

    case 'Cart - Change cart quantity':
      return {
        ...state,
        cart: state.cart.map(product => {
          if ( product._id === action.payload._id && product.size === action.payload.size ) {
            product.quantity = action.payload.quantity
          }
          return product
        })
      }

    case 'Cart - Remove product from cart':
      return {
        ...state,
        cart: state.cart.filter( product =>  !(product._id === action.payload._id && product.size === action.payload.size))
      }

    case 'Cart - Update order summary':
      return {
        ...state,
        ...action.payload
      }

    case 'Cart - Load Address from cookies':
    case 'Cart - Update address':
      return {
        ...state,
        shippingAddress: action.payload
      }

    case 'Cart - Order complete':
      return {
        ...state,
        cart: [],
        numberOfItems: 0,
        total: 0,
        tax: 0,
      }

    default:
      return state
  }
}
