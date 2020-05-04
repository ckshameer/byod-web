import actions from './actions'
import RD from '../../../rd.json'
const fetchRestaurantDetails = (location_id: any) => (dispatch: any) => {
  // dispatch(actions.fetchRestaurantDetails(location_id))
  //   .then((response: any) => {
  //     console.log(RD)
  //     if (response.payload.data.length) {
  //       dispatch(actions.fetchRestaurantDetailsSuccess(response.payload.data))
  //     }
  //   })
  //   .catch((error: any) => {
  //     throw (error)
  //   })
}

const fetchRestaurantDetailsSuccess = () => (dispatch:any) => {
  dispatch(actions.fetchRestaurantDetailsSuccess())
}


const updateRestaurantDetails = (restaurantDetails: any) => (dispatch: any) => {
  dispatch(actions.updateRestaurantDetails(restaurantDetails))
}

export default { fetchRestaurantDetails, updateRestaurantDetails,fetchRestaurantDetailsSuccess }
