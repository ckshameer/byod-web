import React, { Component } from 'react'
import NavigationBar from '../../components/navigationBar/NavigationBar'
import { connect } from 'react-redux'
import { deepCopyFunction } from '../../helpers/utils'
import MenuItemWidget from '../../components/menuItemWidget/MenuItemWidget'
import { cartItemsOperations } from '../../state/features/cartItems'

interface SearchScreenProps {
  categories: any
  updateCartItems: any
  cartItems: any
}
interface SearchScreenState {
  searchKeyword: any
  isSearchFocused: boolean
  categories: any
  filteredCategories: any
  fullCategories: any
  filteredGroupedItemsCategories: any
  restaurantDetails: any
  cart: any
}

class SearchScreen extends Component<SearchScreenProps, SearchScreenState>{
  constructor(props: any) {
    super(props)
    this.state = {
      searchKeyword: '',
      isSearchFocused: false,
      cart: [],
      categories: [],
      fullCategories: [],
      filteredGroupedItemsCategories: [],
      filteredCategories: [],
      restaurantDetails: undefined
    }
  }
  // static getDerivedStateFromProps(nextProps: any, nextState: any) {
  //   console.log('d')
  //   if (nextProps.categories) {
  //     if (nextProps.categories !== nextState.categories) {
  //       return { categories: nextProps.categories, fullCategories: nextProps.categories }
  //     }
  //   }
  //   return null
  // }
  static getDerivedStateFromProps(props: any, state: any) {
    console.log(props)
    if (state.restaurantDetails !== props.restaurantDetails) {
      return { restaurantDetails: props.restaurantDetails }
    }
    return null
  }
  componentDidMount() {
    this.setState({ categories: this.props.categories, fullCategories: this.props.categories })
  }

  async onAddItemClick(item: any, operation: any) {

    let cart = this.state.cart as any

    if (item.count === 0) {
      cart.splice(item, 1)
      this.setState({ cart })
    } else {


      let item_price = item.item_unit_price * item.count

      let item_sub_total = 0
      let modifierSubtotal = 0
      if (item.groups) {
        item.groups.map((group: any) => {
          group.items.map((item: any) => {
            if (item.selected) {
              if (item.count) {
                if (item.count < 0) {
                  modifierSubtotal = modifierSubtotal + (item.item_final_price * 2)
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

      if (operation === 'simpleAdd') {

        console.log('Item to be added to cart', item)
        cart.map((cartItem: any) => {
          if (cart.item_id === item.item_id) {
            cartItem = item
          }
          return cartItem
        })
        const found = cart.some((e: any) => e === item)
        if (!found) {
          cart.push(item)
        }
        this.setState({ cart })
      } else if (operation === 'countAdd' || operation === 'countDelete') {
        cart.map((cartItem: any) => {
          if (cartItem.item_id === item.item_id) {
            return cartItem
          }
        })
      }

    }

    // if (item.count === 0) {
    //   cart.splice(item, 1)
    //   this.setState({ cart })
    // }
    this.props.updateCartItems(this.state.cart)
  }

  getItemFinalPrice = (itemUnitPrice: any, itemTaxes: any) => {
    let tax_rates = [] as any
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
  }

  getTaxValue(taxId: any) {
    let restaurantTaxes = this.state.restaurantDetails.menu.taxes
    let tax = restaurantTaxes.find((tax: any) => tax.tax_id === taxId)
    let taxValue = 0
    if (tax.tax_type === 'PERCENTAGE') {
      taxValue = tax.tax_value / 100
    }
    return taxValue
  }

  preciseItemsSearch = (text: any) => {
    let filteredNames = this.state.categories.filter((e: any) => {
      e.items = e.items.filter((f: any) => {
        if (f.item_name.toLowerCase().includes(text.toLowerCase())) {
          return f;
        } else {
          return false;
        }
      });
      if (e.items.length) {
        return e;
      }
    });
    this.setState({ filteredCategories: filteredNames })
  };

  preciseGroupedItemsSearch = (text: any) => {
    let filteredGrouped = this.state.categories.filter((e: any) => {
      if (e.has_subcategory) {
        e.subcategories = e.subcategories.filter((f: any) => {
          if (f.subcategory_name.toLowerCase().includes(text.toLowerCase())) {
            return f
          } else {
            return false
          }
        })
        if (e.subcategories.length) {
          return e
        }
      }
    })
    this.setState({ filteredGroupedItemsCategories: filteredGrouped })
  }

  async onSearchInputChange(e: any) {
    await this.setState({ searchKeyword: e.target.value, categories: deepCopyFunction(this.state.fullCategories) })
    if (this.state.searchKeyword) {
      this.setState({ isSearchFocused: true })
    } else {
      this.setState({ isSearchFocused: false })
    }
    if (this.state.searchKeyword[0]) {
      await this.preciseItemsSearch(this.state.searchKeyword)
      await this.preciseGroupedItemsSearch(this.state.searchKeyword)
    } else {
      this.setState({ filteredCategories: [] })
      this.setState({ filteredGroupedItemsCategories: [] })
    }
  }
  onSearchInputFocus() {
    this.setState({ isSearchFocused: true })
  }
  onSearchInputFocusBlur() {
    if (!this.state.searchKeyword[0]) {
      this.setState({ isSearchFocused: false })
    }
  }
  render() {
    return (
      <div className='searchScreen screen'>
        <div className={this.state.isSearchFocused ? 'search-header focused' : 'search-header'}>
          <div className={this.state.isSearchFocused ? 'search-message focused' : 'search-message'}>What is your cravings today?</div>
          <input className={this.state.isSearchFocused ? 'search-input focused' : 'search-input'} onBlur={() => this.onSearchInputFocusBlur()} onFocus={() => this.onSearchInputFocus()} onChange={(e: any) => this.onSearchInputChange(e)} placeholder='Search here...' type='text'></input>
        </div>
        <div className='search-items'>
          {
            this.state.filteredCategories.length ?
              this.state.filteredCategories.map((category: any) => {
                return (
                  <div className='search-item'>
                    <div className='category-name'>{category.category_name}</div>
                    {
                      category.items.map((item: any) => {
                        return (
                          <MenuItemWidget onAddItemClick={(item: any, operation: any) => this.onAddItemClick(item, operation)} key={item.item_id} itemDetails={item} />
                        )
                      })}
                  </div>
                )
              })
              :
              <div />
          }
          {
            this.state.filteredGroupedItemsCategories.length ?
              this.state.filteredGroupedItemsCategories.map((category: any) => {
                return (
                  <div className='search-item'>
                    <div className='category-name'>{category.category_name}</div>
                    {
                      category.subcategories.map((item: any) => {
                        return (
                          <MenuItemWidget key={item.subcategory_id} onAddItemClick={(item: any, operation: any) => this.onAddItemClick(item, operation)} itemDetails={item} />
                        )
                      })}
                  </div>
                )
              })
              :
              <div />
          }
        </div>
        <div id='abcd'></div>
        <NavigationBar  />
      </div>
    )
  }
}

const mapStateToProps = (state: any) => {
  let categories = state.restaurantDetails.restaurantDetails.menu.categories
  let restaurantDetails = state.restaurantDetails.restaurantDetails
  let cartItems = state.cartItems.cartItems
  return ({ categories, restaurantDetails, cartItems })
}

const mapDispatchToProps = {
  updateCartItems: cartItemsOperations.updateCartItems
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen) 
