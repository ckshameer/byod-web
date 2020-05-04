import * as types from './types'

const fetchCartItems = () => ({
  type: types.FETCH_CART_ITEMS
})

const updateCartItems = (cartItems: any) => ({
  type: types.UPDATE_CART_ITEMS,
  payload: cartItems
})

export default { fetchCartItems, updateCartItems }
