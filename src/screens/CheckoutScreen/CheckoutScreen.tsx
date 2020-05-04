import React, { Component } from 'react'
import { connect } from 'react-redux'
import PaymentSelector from '../../components/paymentSelector/PaymentSelector'

interface CheckoutScreenProps { }
interface CheckoutScreenState {
  cartItems: any,
  restaurantDetails: any
  totalTax: any
  totalAmount: any
  subTotal: any
  selectedPayment: any
  openPaymentSelector: boolean
}

class CheckoutScreen extends Component<CheckoutScreenProps, CheckoutScreenState> {
  constructor(props: any) {
    super(props)
    this.state = {
      cartItems: [],
      restaurantDetails: {},
      totalTax: null,
      totalAmount: null,
      subTotal: null,
      selectedPayment: {},
      openPaymentSelector: false
    }
  }

  static getDerivedStateFromProps(nextProps: any, nextState: any) {
    console.log(nextProps)
    console.log(nextState)
    if (nextProps.restaurantDetails !== nextState.restaurantDetails) {
      return { cartItems: nextProps.cartItems, restaurantDetails: nextProps.restaurantDetails }
    }
    return null
  }

  componentDidMount() {
    this.chargesCalculations(this.state.cartItems)

    let defaultPayment = this.state.restaurantDetails.payment_types.find((payment: any) => payment.is_default)
    this.setState({ selectedPayment: defaultPayment })

  }

  chargesCalculations(cart: any) {

    let charges = this.state.restaurantDetails.menu.charges
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

    console.log(surcharge_tax)

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

    console.log(total_tax)


    let total_amount = sum_of_all_items_unit_price + total_surcharge + total_tax

    this.setState({ totalTax: total_tax, totalAmount: total_amount, subTotal: sum_of_all_items_unit_price })
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

  onPaymentClick() {
    this.setState({ openPaymentSelector: true })
  }

  onPaymentSelectorClose() {
    this.setState({ openPaymentSelector: false })
  }

  onPaymentChange(paymentMethod: any) {
    this.setState({ selectedPayment: paymentMethod })
    this.setState({ openPaymentSelector: false })
  }

  render() {
    if (this.state.openPaymentSelector) {
      return (
        <PaymentSelector onPaymentSelect={(paymentMethod: any) => this.onPaymentChange(paymentMethod)} onClose={() => this.onPaymentSelectorClose()} paymentMethods={this.state.restaurantDetails.payment_types} />
      )
    }
    return (
      <div className='screen checkoutScreen'>
        <div className='checkout-header'>
          <h1>Checkout</h1>
        </div>
        <div className='order-summery'>
          <div className='head'>Order Summery</div>
          {
            this.state.cartItems.length &&
            this.state.cartItems.map((cartItem: any) => {
              return (
                <div key={cartItem.item_id} className='order-item'>
                  <img className='order-image' src={cartItem.item_image_url ? cartItem.item_image_url : require('../../assets/images/no-preview.png')} alt='order'></img>
                  <div className='order-name'>{cartItem.item_name}</div>
                  <div className='order-count'>x{cartItem.count}</div>
                </div>
              )
            })
          }
        </div>
        <div className='payment-method' onClick={() => this.onPaymentClick()}>
          <img className='payment-icon' src={require('../../assets/images/cash.png')} alt='cash' />
          <div className='payment-name'>
            <p className='label'>PAYMENT</p>
            <p className='payment'>
              {this.state.selectedPayment && this.state.selectedPayment.display_name}
            </p>
          </div>
          <div className='select-button'>CHANGE</div>
        </div>
        <div className='amount-details'>
          <div className='charges'>
            <p className='charge-name'>Subtotal</p>
            <p className='charge-amount'>{this.state.subTotal && this.state.subTotal.toFixed(2)} AED</p>
          </div>

          {
            this.state.restaurantDetails.menu.charges.length ?
              this.state.restaurantDetails.menu.charges.map((charge: any) => {
                return (
                  <div key={charge.charge_id} className='charges'>
                    <p>{charge.charge_name}</p>
                    <p>{this.subchargeCalculations(charge)}</p>
                  </div>
                )
              })
              : null
          }

          <div className='charges total'>
            <p className='charge-name total'>Total</p>
            <p className='charge-amount total'>{this.state.totalAmount && this.state.totalAmount.toFixed(2)} AED</p>
          </div>
        </div>
        <button className='checkout-button'>Pay {this.state.totalAmount && this.state.totalAmount.toFixed(2)}</button>
      </div>
    )
  }
}

const mapStateToProps = (state: any) => {
  let { cartItems } = state.cartItems
  let { restaurantDetails } = state.restaurantDetails
  return ({ restaurantDetails, cartItems })
}

export default connect(mapStateToProps)(CheckoutScreen)
