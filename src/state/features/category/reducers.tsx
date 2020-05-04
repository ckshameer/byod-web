import * as types from './types'
import { combineReducers } from 'redux'

const INITIAL_STATE = '' as any

const categorySelectReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case types.FETCH_SELECTED_CATEGORY:
      return state
    case types.UPDATE_SELECTED_CATEGORY:
      return action.payload
    default:
      return state
  }
}

const reducer = combineReducers({
  categorySelect: categorySelectReducer
})

export default reducer
