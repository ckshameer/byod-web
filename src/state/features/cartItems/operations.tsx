import actions from './actions'

const updateCartItems = (cartItems: any) => (dispatch: any) => {
  console.log(cartItems)
  dispatch(actions.updateCartItems(cartItems))
}

const fetchCartItems = () => (dispatch: any) => {
  dispatch(actions.fetchCartItems())
}

export default { updateCartItems,fetchCartItems }
