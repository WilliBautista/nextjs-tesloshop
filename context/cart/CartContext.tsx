import { createContext } from 'react'

import { ICartProduct, ShippingAddress } from '../../interfaces'

interface ContextProps {
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
  shippingAddress?: ShippingAddress;

  // Methods
  addProductToCart: ( product: ICartProduct ) => void;
  updateCartQuantity: ( product: ICartProduct ) => void;
  removeProductFromCart: ( product: ICartProduct ) => void;
  updateAddress: (shippingAddress: ShippingAddress) => void;
  createOrder: () => Promise<{ hasError: boolean; message: string }>;
}

export const CartContext = createContext({} as ContextProps)
