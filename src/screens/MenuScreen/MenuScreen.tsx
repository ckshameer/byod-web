import React, { Component } from 'react'
import { NormalSpinner } from '../../components/preloader/Preloaders';
import { RouteComponentProps } from 'react-router-dom'
import Offer from '../../assets/images/offer.jpg'
import MenuItemWidget from '../../components/menuItemWidget/MenuItemWidget';
import { connect } from 'react-redux';
import { cartItemsOperations } from '../../state/features/cartItems';
import NavigationBar from '../../components/navigationBar/NavigationBar';
import $ from 'jquery'
import { deepCopyFunction } from '../../helpers/utils';
import { cartItems } from '../../state/features';

interface MenuProps {
  fetchRestaurantDetails: any
  restaurantDetails: any
  updateCartItems: any
  fetchCartItems: any
  cartItems: any

}
interface MenuState {
  isLoading: boolean
  restaurantDetails: any
  menu: any
  selectedCategory: any
  cart: any
  openCategory: boolean
  updatingCart: any
  // scrollToContainer: any
}

class MenuScreen extends Component<RouteComponentProps & MenuProps, MenuState> {


  constructor(props: any) {
    super(props)
    this.state = {
      isLoading: false,
      restaurantDetails: undefined,
      menu: [],
      selectedCategory: '',
      cart: [],
      openCategory: false,
      updatingCart: []
      // scrollToContainer: this.scrollToContainer.bind(this)
    }
  }

  static getDerivedStateFromProps(props: any, state: any) {
    if (state.selectedCategory !== props.selectedCategory) {
      let id = '#' + props.selectedCategory
      return { selectedCategory: id }
    }
    if (state.restaurantDetails !== props.restaurantDetails) {
      return { restaurantDetails: props.restaurantDetails, menu: props.menuItems }
    }
    return null;
  }

  componentDidMount() {
    this.setState({ cart: this.props.cartItems })
    this.setState({ menu: this.addCountToModifier(this.state.menu) }, () => this.updateMenu(this.state.menu))
  }

  updateMenu(menu: any) {
    let newMenu = this.state.menu.map((category: any) => {
      category.items = category.items.map((menuItem: any) => {
        this.state.cart.map((cartItem: any) => {
          if (menuItem.item_id === cartItem.item_id) {
            menuItem = cartItem
          }
        })
        return menuItem
      })
      return category
    })
    this.setState({menu:newMenu})
  }

  addCountToModifier(menu: any) {
    let updatedMenu = menu.map((menuItem: any) => {
      if (menuItem.items) {
        menuItem.items.map((item: any) => {
          if (item.groups.length) {
            item.groups.map((group: any) => {
              group.items.map((item: any) => {
                item.selected = false
                if (group.group_has_quantity_selector) {
                  item.count = 0
                }
                return null
              })
              return null
            })
          }
          return null
        })
      }
      return menuItem
    })
    return updatedMenu
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    if (this.state.selectedCategory[0]) {
      if (this.state.selectedCategory !== prevState.selectedCategory) {
        this.scrollToContainer(this.state.selectedCategory)
      }
    }
  }


  scrollToContainer(id: any) {
    console.log('scroll to :', id)
    $('#cont').animate({ scrollTop: $(id).offset()!.top - 250 }, 2000)
  }

  onMenuScroll() {
    if (this.state.selectedCategory[0]) {
      this.setState({ selectedCategory: '' })
    }
  }

  onCategoryClick(category: any) {
    this.setState({ selectedCategory: category.category_id })
  }

  async onAddItemClick(cpitem: any, operation: any) {
    const item = deepCopyFunction(cpitem);
    let cartItems = [...this.state.cart];
    if (item.count === 0) {
      cartItems.splice(item, 1)
      this.setState({ cart: cartItems }, () => this.props.updateCartItems(this.state.cart))
    } else {
      let item_price = item.item_unit_price * item.count
      let item_sub_total = 0
      let modifierSubtotal = 0
      if (item.groups) {
        item.groups.map((group: any) => {
          group.items.map((item: any) => {
            if (item.selected) {
              if (item.count) {
                if (item.count > 0) {
                  modifierSubtotal = modifierSubtotal + (item.item_final_price * item.count)
                }
              } else {
                modifierSubtotal = modifierSubtotal + item.item_final_price
              }
            }
          })
        })
        item_sub_total = item_price + (modifierSubtotal * item.count)
      } else {
        item_sub_total = item_price
      }
      let final_price = this.getItemFinalPrice(item_sub_total, item.item_taxes)
      item.final_price = final_price
      item.item_sub_total = item_sub_total

      const itemToBeAdded = item


      if (operation === 'simpleAdd') {
        const found = cartItems.some((e: any) => e.item_id === itemToBeAdded.item_id)
        if (!found) {
          this.setState({ cart: [...cartItems, itemToBeAdded] }, () => this.props.updateCartItems(this.state.cart))
        } else {
          console.log({ cartItems });
        }
      } else if (operation === 'countAdd' || operation === 'countDelete') {
        cartItems = cartItems.map((cartItem: any) => {
          if (cartItem.item_id === itemToBeAdded.item_id) {
            cartItem = itemToBeAdded
          }
          return cartItem
        })
        this.setState({ cart: cartItems }, () => this.props.updateCartItems(this.state.cart))
      }
    }
  }

  getItemFinalPrice = (itemUnitPrice: any, itemTaxes: any) => {
    let tax_rates = [] as any
    if (itemTaxes.length) {
      itemTaxes.map((itemTax: any) => {
        itemTax.taxes.map((tax: any) => {
          let taxValue = this.getTaxValue(tax)
          tax_rates.push(taxValue)
        })
      })
      let final_price = 0
      tax_rates.map((tax_rate: number) => {
        if (final_price) {
          let tax_difference = Math.abs(itemUnitPrice - (itemUnitPrice + (itemUnitPrice * tax_rate)))
          final_price = final_price + tax_difference
        } else {
          final_price = itemUnitPrice + (itemUnitPrice * tax_rate)
        }
        return final_price
      })
      return final_price
    } else {
      return itemUnitPrice
    }
  }

  getTaxValue(taxId: any) {
    let restaurantTaxes = this.state.restaurantDetails.menu.taxes
    let taxValue = 0
    if (restaurantTaxes.length) {
      let tax = restaurantTaxes.find((tax: any) => tax.tax_id === taxId)
      if (tax.tax_type === 'PERCENTAGE') {
        taxValue = tax.tax_value / 100
      }
      return taxValue
    } else {
      return taxValue
    }
  }
  onCloseClick() {
    this.setState({ openCategory: false })
  }


  render() {
    const { isLoading } = this.state
    return (
      <React.Fragment>
        {
          isLoading ?
            <div className='loader'>
              <NormalSpinner />
            </div>
            :
            <div className='screen menuscreen' onScroll={() => this.onMenuScroll()} id='cont'>
              <div className='offer-banner' style={{ backgroundImage: `url(${Offer})` }}></div>
              <div className='menulist-container' id='menulist-container'>
                {this.state.menu.length ?
                  this.state.menu.map((menu: any) => {
                    return (
                      <div id={`${menu.category_id}`} key={menu.category_id} className='menu-container'>
                        <div className='category-name'>{menu.category_name}</div>
                        {menu.items.map((menuItem: any) => {
                          return (
                            <MenuItemWidget onAddItemClick={(item: any, operation: any) => this.onAddItemClick(item, operation)} key={menuItem.item_id} itemDetails={menuItem} />
                          )
                        })}
                        {
                          menu.has_subcategory &&
                          menu.subcategories.map((subcategory: any) => {
                            return (
                              <MenuItemWidget key={subcategory.subcategory_id} onAddItemClick={(item: any, operation: any) => this.onAddItemClick(item, operation)} itemDetails={subcategory} />
                            )
                          })
                        }
                      </div>
                    )
                  })
                  : <div />
                }
              </div>
            </div>
        }
        <NavigationBar cartItems={this.state.cart.length && this.state.cart} />
      </React.Fragment>
    )
  }
}
const mapDispatchToProps = {
  updateCartItems: cartItemsOperations.updateCartItems,
  fetchCartItems: cartItemsOperations.fetchCartItems
}
const mapStateToProps = (state: any) => {
  let cartItems = state.cartItems.cartItems
  let selectedCategory = state.selectCategory.categorySelect
  let menuItems = state.menuItems.menuItems
  let restaurantDetails = state.restaurantDetails.restaurantDetails
  return { menuItems, restaurantDetails, selectedCategory, cartItems }
}
export default connect(mapStateToProps, mapDispatchToProps)(MenuScreen)
