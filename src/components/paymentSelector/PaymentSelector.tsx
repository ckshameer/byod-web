import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

interface PaymentSelectorProps {
  paymentMethods: any
  onClose: any
  onPaymentSelect: any
}
interface PaymentSelectorState {
  paymentMethods: any
  selectedPayment: any
}

class PaymentSelector extends Component<PaymentSelectorProps, PaymentSelectorState>{
  constructor(props: any) {
    super(props)
    this.state = {
      paymentMethods: [],
      selectedPayment: {}
    }
  }
  static getDerivedStateFromProps(nextProps: any, nextState: any) {
    if (nextProps.paymentMethods !== nextState.paymentMethods) {
      return { paymentMethods: nextProps.paymentMethods }
    }
    return null
  }

  componentDidMount() {
    console.log(this.props)
  }

  onPaymentClick(paymentMethod: any) {
    this.setState({ selectedPayment: paymentMethod })


  }
  selectPaymentMethod() {
    this.props.onPaymentSelect(this.state.selectedPayment)
  }

  onClose() {
    this.props.onClose()
  }
  render() {
    return (
      <div className='selector-modal paymentSelector'>
        <div className='modal-header'>
          <div className="close-icon" onClick={() => this.onClose()}>
            <FontAwesomeIcon icon={faTimes} size='lg' />
          </div>
          <p>Select your</p>
          <h1 className='item-name'>Payment Method</h1>
        </div>
        <div className='payments-container'>
          {
            this.state.paymentMethods.length &&
            this.state.paymentMethods.map((paymentMethod: any) => {
              return (
                <div key={paymentMethod.payment_type_id} className={(paymentMethod.payment_type_id === this.state.selectedPayment.payment_type_id) ? 'payment-method selected' : 'payment-method'} onClick={() => this.onPaymentClick(paymentMethod)}>
                  <img className='payment-icon' src={require('../../assets/images/no-preview.png')} alt='payment' />
                  <div className='payment-name'>{paymentMethod.display_name}</div>
                </div>
              )
            })
          }
        </div>
        {
          this.state.selectedPayment.payment_type_id ?
            <div className='add-to-cart' onClick={() => this.selectPaymentMethod()}>Select Payment</div>
            : null
        }
      </div>
    )
  }
}
export default PaymentSelector
