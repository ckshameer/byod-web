import * as types from './types'

const fetchMenu = () => ({
  type: types.FETCH_MENU
})

const updateMenu = (menuItems: any) => ({
  type: types.UPDATE_MENU,
  payload: menuItems
})

export default { fetchMenu, updateMenu }
