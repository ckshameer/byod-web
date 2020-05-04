import actions from './actions'

const updateSelectedCategory = (categoryId: any) => (dispatch: any) => {
  dispatch(actions.updateSelectedCategory(categoryId))
}

const fetchSelectedCategory = () => (dispatch: any) => {
  dispatch(actions.fetchSelectedCategory())
}

export default { updateSelectedCategory,fetchSelectedCategory }
