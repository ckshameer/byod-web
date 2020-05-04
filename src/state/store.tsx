// import { createStore, applyMiddleware, combineReducers } from 'redux'
// import * as reducers from './features'
// import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
// import axiosMiddleware from 'redux-axios-middleware'
// import axiosClient, { setAuthHeader } from './middlewares/axiosClient'
// import thunk from 'redux-thunk'
// import storeInitailState from './storeInitialState'

// const rootReducer = combineReducers(reducers)


// const store = createStore(
//   rootReducer,
//   storeInitailState,
//   composeWithDevTools(applyMiddleware(axiosMiddleware(axiosClient), thunk))
// )

// store.subscribe(() => {
//   const headers = {
//     "Content-Type": "application/json",
//     "Access-Control-Allow-Origin": "*",
//     "pos-api-key": "467eca39e7d506fcf599783d2d3c8666"
//   }
//   setAuthHeader(headers)
// })

// export { store }

import { createStore, applyMiddleware, combineReducers } from 'redux'
import * as reducers from './features'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import axiosMiddleware from 'redux-axios-middleware'
import axiosClient, { setAuthHeader } from './middlewares/axiosClient'
import thunk from 'redux-thunk'
import storeInitailState from './storeInitialState'
import { persistStore } from 'redux-persist'

const rootReducer = combineReducers(reducers)


const store = createStore(
  rootReducer,
  storeInitailState as any,
  composeWithDevTools(applyMiddleware(axiosMiddleware(axiosClient), thunk))
)

store.subscribe(() => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "pos-api-key": "eb815db2c37eb14303a0dbccc365e194"
  }
  setAuthHeader(headers)
})

const persistor = persistStore(store)


export { store }
export { persistor as storePersistor }
