import * as types from './types'

const fetchRestaurantDetails = (location_id: any) => ({
  type: types.FETCH_RESTUARANT_DETAILS,
  payload: {
    request: {
      method: 'get',
      url: `location/${location_id}/menu`
    }
  }
});

const fetchRestaurantDetailsSuccess = () => ({
  type: types.FETCH_RESTUARANT_DETAILS_SUCCESS,
  // payload: {
  // }
})
// const fetchRestaurantDetailsSuccess = (restaurantDetails: any) => ({
//   type: types.FETCH_RESTUARANT_DETAILS_SUCCESS,
//   restaurantDetails
//   // payload: {
//   // }
// })

const fetchRestaurantDetailsFailed = () => { }

const updateRestaurantDetails = (restaurantDetails: any) => ({
  type: types.UPDATE_RESTUARANT_DETAILS,
  payload: restaurantDetails
})

export default { fetchRestaurantDetails, fetchRestaurantDetailsSuccess, updateRestaurantDetails }
