import actions from './actions'

const updateMenu = (menuItems: any) => (dispatch: any) => {
  dispatch(actions.updateMenu(menuItems))
}

const fetchMenu = () => (dispatch: any) => {
  dispatch(actions.fetchMenu())
}

export default { updateMenu,fetchMenu }
