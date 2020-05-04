
import * as types from './types'

const fetchSelectedCategory = () => ({
  type: types.FETCH_SELECTED_CATEGORY
})

const updateSelectedCategory = (categoryId: any) => ({
  type: types.UPDATE_SELECTED_CATEGORY,
  payload: categoryId
})

export default { fetchSelectedCategory, updateSelectedCategory }
