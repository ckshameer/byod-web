import * as types from './types'
import { combineReducers } from 'redux'

const INITIAL_STATE = [] as any

const cartItemsReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case types.FETCH_CART_ITEMS:
      return state
    case types.UPDATE_CART_ITEMS:
      return action.payload
    default:
      return state
  }
}

const reducer = combineReducers({
  cartItems: cartItemsReducer
})

export default reducer
