import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import DineIn from '../../assets/images/dine.png'
import Takeaway from '../../assets/images/takeaway.png'
import strings from '../../strings'
import { connect } from 'react-redux'
import { restaurantDetailsOperations } from '../../state/features/restaurantDetails'
import MenuApi from '../../services/MenuApi'
import { menuOperations } from '../../state/features/menuItems'
import { getUpdatedMenu } from '../../helpers/utils'
import RD from '../../rd.json'

const orderOptions = [
  {
    'option_id': 1,
    'option_name': strings.eatin,
    'option_img': DineIn
  }, {
    'option_id': 2,
    'option_name': strings.takeaway,
    'option_img': Takeaway
  }
]

interface OrderOptionProps {
  fetchRestaurantDetails: any,
  restaurantDetails: any
  updateMenu: any
  updateRestaurantDetails: any
}
interface OrderOptionState {
  value: any
  restaurantDetails: any
  menu: any
  isLoading: boolean
}
class OrderOption extends Component<OrderOptionProps, OrderOptionState> {

  private MenuApi: MenuApi;

  constructor(props: OrderOptionProps) {
    super(props)

    this.MenuApi = new MenuApi()

    this.state = {
      value: 'en',
      restaurantDetails: {},
      menu: [],
      isLoading: false
    }
  }

  async componentDidMount() {
    let locationId = localStorage.getItem('locationId')

    const headers = {
      'pos-api-key': 'eb815db2c37eb14303a0dbccc365e194'
    }

    const refreshBody = {
      "process_state_id": 1
    }
    let storage: any = localStorage.getItem('persist:restaurantDetails')
    let parsedStorage = JSON.parse(storage)
    let restaurantDetails = JSON.parse(parsedStorage.restaurantDetails)


    // const result = await this.MenuApi.refreshMenu(locationId, refreshBody, headers)
    // if (result.code === 200) {
    //   this.props.fetchRestaurantDetails(locationId)
    // }

    this.props.updateRestaurantDetails(RD)

    strings.setLanguage(this.state.value)
  }

  static getDerivedStateFromProps(props: any, state: any) {
    props.updateRestaurantDetails(RD)
    return null
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    if (prevState.restaurantDetails !== this.props.restaurantDetails) {
      const menuCategories = getUpdatedMenu(this.props.restaurantDetails)
      this.setState({ restaurantDetails: this.props.restaurantDetails, menu: menuCategories })
      this.props.updateMenu(menuCategories)
    }
  }

  onLanguageSelect(language: any) {
    this.setState({ value: language })
    strings.setLanguage('ar')
  }


  render() {
    return (
      <div className='screen orderOption-screen'>
        <div className='order-options'>
          {
            this.state.restaurantDetails &&
            orderOptions.map((option) => {
              return (
                <Link to={{ pathname: '/menu', state: { restaurantDetails: this.state.restaurantDetails, menu: this.state.menu } }} key={option.option_id}>
                  <div className='option'>
                    <img className='option-image' src={option.option_img} alt='orderOption'></img>
                    <p className='option-name'>{option.option_name}</p>
                  </div>
                </Link>
              )
            })
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: any) => {
  console.log(state)
  return {
    restaurantDetails: state.restaurantDetails.restaurantDetails,
  }
}

const mapDispatchToProps = {
  fetchRestaurantDetails: restaurantDetailsOperations.fetchRestaurantDetails,
  updateRestaurantDetails: restaurantDetailsOperations.updateRestaurantDetails,
  updateMenu: menuOperations.updateMenu
}
export default connect(mapStateToProps, mapDispatchToProps)(OrderOption)
