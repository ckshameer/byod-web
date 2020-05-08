import React, { Component } from 'react'
import { RouteComponentProps, Link } from 'react-router-dom'
import MenuItemWidget from '../../components/menuItemWidget/MenuItemWidget'
import { connect } from 'react-redux'
import { cartItemsOperations } from '../../state/features/cartItems'
import NavigationBar from '../../components/navigationBar/NavigationBar'
import { deepCopyFunction } from '../../helpers/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import CashPayment from '../../components/cashPayment/CashPayment'

interface CartScreenProps {
  updateCartItems: any
}
interface CartScreenState {
  cartItems: any
  restaurantDetails: any
  restaurantCharges: any
  restaurantTaxes: any
  totalTax: any
  totalAmount: any
  subTotal: any
  showOrderDetails: boolean
  openCashPaymentModal: boolean
}



class CartScreen extends Component<RouteComponentProps & CartScreenProps, CartScreenState> {
  constructor(props: any) {
    super(props)
    this.state = {
      cartItems: [],
      restaurantDetails: {},
      restaurantCharges: {},
      restaurantTaxes: {},
      totalTax: null,
      totalAmount: null,
      subTotal: null,
      showOrderDetails: false,
      openCashPaymentModal: false
    }
  }
  async componentDidMount() {
    // const { cart, restaurantDetails } = this.props.location.state as any
    const { cart, restaurantDetails } = this.props as any
    console.log(this.props.location)
    await this.setState({ cartItems: cart, restaurantDetails, restaurantCharges: restaurantDetails.menu.charges, restaurantTaxes: restaurantDetails.menu.taxes })
    if (this.state.cartItems.length) {
      this.chargesCalculations(this.state.cartItems)
    }
  }


  async onAddItemClick(cpitem: any, operation: any) {

    let item = deepCopyFunction(cpitem)

    let cartItems = deepCopyFunction([...this.state.cartItems])


    if (item.count === 0) {
      console.log('cart before splice', cartItems)
      console.log('item to delete', { item })
      cartItems.splice(item, 1)
      console.log('cart after splice', cartItems)
      this.setState(
        { cartItems },
        () => {
          this.updateTax(this.state.cartItems);
          this.chargesCalculations(this.state.cartItems)
        }
      )
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

      const itemToBeAdded = deepCopyFunction(item)
      console.log(itemToBeAdded)

      if (operation === 'update') {
        // console.log('update')
        cartItems = cartItems.map((cartItem: any) => {
          if (cartItem.item_id === item.item_id) {
            if (cartItem.optional === true) {
              cartItem.optional = false
            }
            cartItem = itemToBeAdded
          }
          return cartItem
        })
        // this.setState({ cartItems }, () => console.log(this.state.cartItems))
        this.setState(
          { cartItems },
          () => {
            this.props.updateCartItems(this.state.cartItems);
            this.updateTax(this.state.cartItems);
            this.chargesCalculations(this.state.cartItems)
          }
        )
      }

      if (operation === 'simpleAdd') {
        const found = cartItems.some((e: any) => e === item)
        if (!found) {
          this.setState(
            { cartItems: [...cartItems, itemToBeAdded] },
            () => {
              this.props.updateCartItems(this.state.cartItems);
              this.updateTax(this.state.cartItems);
              this.chargesCalculations(this.state.cartItems)
            }
          )
        } else {
        }
      } else if (operation === 'countAdd' || operation === 'countDelete') {
        cartItems = cartItems.map((cartItem: any) => {
          if (cartItem.item_id === itemToBeAdded.item_id) {
            cartItem = itemToBeAdded
          }
          return cartItem
        })
        this.setState(
          { cartItems },
          () => {
            this.props.updateCartItems(this.state.cartItems);
            this.updateTax(this.state.cartItems);
            this.chargesCalculations(this.state.cartItems)
          }
        )
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

  subchargeCalculations = (charge: any) => {
    if (charge.charge_type === 'FIXED') {
      return charge.charge_value
    }
    if (charge.charge_type === 'PERCENTAGE') {
      console.log(charge.charge_type)
    }
  }

  chargesCalculations(cart: any) {

    let charges = this.state.restaurantCharges

    let surcharge_tax = charges.map((charge: any) => {
      if (charge.charge_type === 'FIXED') {
        if (charge.charge_taxes.length) {
          let tax_value = this.getTaxValue(charge.charge_taxes[0].taxes[0])
          return charge.charge_value * tax_value
        } else {
          return 0
        }
      }
      if (charge.charge_type === 'PERCENTAGE') {
        return 0
      }
    })

    let sum_of_all_items_final_price = 0
    let sum_of_all_items_unit_price = 0
    cart.map((cartItem: any) => {
      sum_of_all_items_final_price = sum_of_all_items_final_price + cartItem.final_price
      sum_of_all_items_unit_price = sum_of_all_items_unit_price + cartItem.item_sub_total
    })


    let sum_of_surcharge_taxes = 0
    surcharge_tax.map((tax: any) => {
      sum_of_surcharge_taxes = sum_of_surcharge_taxes + tax
    })

    let total_tax = (sum_of_all_items_final_price - sum_of_all_items_unit_price) + sum_of_surcharge_taxes


    let total_surcharge = 0
    charges.map((charge: any) => {
      if (charge.charge_type === 'FIXED') {
        total_surcharge = total_surcharge + charge.charge_value
      }
      if (charge.charge_type === 'PERCENTAGE') {
        return 0
      }
    })

    let total_amount = sum_of_all_items_unit_price + total_surcharge + total_tax

    this.setState({ totalTax: total_tax, totalAmount: total_amount, subTotal: sum_of_all_items_unit_price })
  }

  onPaymentClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    this.setState({ openCashPaymentModal: true })
  }

  updateTax(cartItems: any) {

  }

  onBackClick() {
    this.props.history.goBack()
  }

  render() {
    return (
      <div className='screen basket-screen'>
        <div className='basket-header'>
          <h1>Your Basket</h1>
          <Link to='/menu'><u>Order more</u></Link>
        </div>
        <div className='basketItems-list'>
          {
            this.state.cartItems &&
              this.state.cartItems.length ?
              this.state.cartItems.map((cartItem: any) => {
                return (
                  <MenuItemWidget onCart onAddItemClick={(item: any, operation: any) => this.onAddItemClick(item, operation)} key={cartItem.item_id} itemDetails={cartItem} />
                )
              })
              :
              <div className='empty-basket' style={{ textAlign: 'center' }}>
                <h1>Your Basket is empty</h1>
                <Link className='backToMenu' to='/#' onClick={() => this.onBackClick()}>Back to Menu</Link>
              </div>
          }
        </div>
        {
          this.state.cartItems &&
            this.state.cartItems.length ?
            <div className='amount-details'>
              <p className='amount-message'>
                Total Order Amount
                <span className='show-details' onClick={() => this.setState({ showOrderDetails: !this.state.showOrderDetails })}>
                  <FontAwesomeIcon size='1x' icon={faExclamationCircle} />
                </span>
              </p>
              <h1 className='total-amount'><span >AED</span> {this.state.totalAmount && this.state.totalAmount.toFixed(2)}</h1>
              {
                this.state.showOrderDetails &&
                <div className='other-charges'>
                  <p className='charges'>Subtotal: {this.state.subTotal && this.state.subTotal.toFixed(2)}</p>
                  {

                    this.state.restaurantCharges.length ?
                      this.state.restaurantCharges.map((charge: any) => {
                        return (
                          <p key={charge.charge_id} className='charges'>{charge.charge_name + ': '}{this.subchargeCalculations(charge)}</p>
                        )
                      })
                      : null
                  }
                  <p className='charges'>TAX: {this.state.totalTax && this.state.totalTax.toFixed(2)}</p>
                </div>
              }
            </div>
            : <div></div>
        }
        {
          this.state.cartItems &&
          this.state.cartItems.length &&
          <div className='actions'>
            <button className='checkout-button' onClick={this.onPaymentClick}>Pay at Counter</button>
            <Link to='#' className='checkout-button' >Other Payment Options</Link>
          </div>
        }
        {/* <NavigationBar cartItems={this.state.cartItems.length && this.state.cartItems} /> */}
        {
          this.state.openCashPaymentModal &&
          <CashPayment onClose={() => this.setState({ openCashPaymentModal: false })} />
        }
      </div >
    )
  }
}

const mapPropsToState = (state: any) => {
  let cart = state.cartItems.cartItems
  let restaurantDetails = state.restaurantDetails.restaurantDetails
  return { cart, restaurantDetails }
}

const mapDispatchToProps = {
  updateCartItems: cartItemsOperations.updateCartItems
}

export default connect(mapPropsToState, mapDispatchToProps)(CartScreen) 
