import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faShoppingCart, faUtensils } from '@fortawesome/free-solid-svg-icons'
import { connect } from 'react-redux'
import { cartItemsOperations } from '../../state/features/cartItems'
import CategoryMenuScreen from '../../screens/CategoryMenu/CategoryMenuScreen'

interface NavigationBarProps {
  cart?: any
  cartItems?: any
  fetchCartItems?: any
}
interface NavigationBarState {
  openCategorySelector: boolean
}

class NavigationBar extends Component<NavigationBarProps, NavigationBarState>{
  constructor(props: any) {
    super(props)
    this.state = {
      openCategorySelector: false
    }
  }
  componentDidMount() {
    this.props.fetchCartItems()
  }

  onCategoryIconClick() {
    this.setState({ openCategorySelector: true })
    // console.log(this.state.openCategorySelector);
  }
  onCloseClick() {
    this.setState({ openCategorySelector: false })
  }

  render() {
    let cartCount = 0
    this.props.cart.map((cartItem: any) => {
      cartCount = cartCount + cartItem.count
    })
    return (
      <div className='navigationBar'>
        <Link className='menu-item' to='/search'>
          <FontAwesomeIcon size='2x' icon={faSearch}></FontAwesomeIcon>
        </Link>
        {/* <div className='menu-item category' onClick={() => this.onCategoryIconClick()}> */}
        <Link to={{ pathname: '/menu', state: 'openCategory' }} className='menu-item category' onClick={() => this.onCategoryIconClick()}>
          <FontAwesomeIcon size='2x' icon={faUtensils}></FontAwesomeIcon>
        </Link>
        <Link className='menu-item cart-icon' to='/cart'>
          <FontAwesomeIcon size='2x' icon={faShoppingCart}></FontAwesomeIcon>
          {(cartCount > 0) &&
            <div className='item-count'> {cartCount}</div>
          }
        </Link>
        {
          this.state.openCategorySelector &&
          <CategoryMenuScreen onClose={() => this.onCloseClick()} />
        }
      </div>
    )
  }
}

const mapStateToProps = (state: any) => {
  const cart = state.cartItems.cartItems
  return {
    cart
  }
}

const mapDispatchToProps = {
  fetchCartItems: cartItemsOperations.fetchCartItems
}

export default connect(mapStateToProps, mapDispatchToProps)(NavigationBar) 
