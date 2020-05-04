import * as types from './types'
import { combineReducers } from 'redux'

const INITIAL_STATE = [] as any

const menuItemsReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case types.FETCH_MENU:
      return state
    case types.UPDATE_MENU:
      return action.payload
    default:
      return state
  }
}

const reducer = combineReducers({
  menuItems: menuItemsReducer
})

export default reducer
