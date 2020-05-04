// import * as types from './types'
// import { combineReducers } from 'redux'

// const restaurantDetailsReducer = (state = [], action: any) => {
//   switch (action.type) {
//     case types.FETCH_RESTUARANT_DETAILS_SUCCESS:
//       return action.payload.data
//     default: return state
//   }
// }

// const reducer = combineReducers({
//   restaurantDetails: restaurantDetailsReducer
// })

// export default reducer

import * as types from './types'
import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'

export type restaurantDetailsReducer<state, action> = (state: any, action: any) => state;

const restaurantDetailsReducer = (state = [], action: any) => {
  switch (action.type) {
    // case types.FETCH_RESTUARANT_DETAILS_SUCCESS:
    //   return action.payload.data
    case types.FETCH_RESTUARANT_DETAILS_SUCCESS:
      return state
    case types.UPDATE_RESTUARANT_DETAILS:
      return action.payload
    default: return state
  }
}

const persistConfig = {
  key: 'restaurantDetails',
  storage: storage,
  stateReconciler: hardSet,
  blacklist: []
};

const reducer: restaurantDetailsReducer<any, any> = combineReducers({
  restaurantDetails: restaurantDetailsReducer
})

const persistingReducer = persistReducer(persistConfig, reducer);

export default persistingReducer
