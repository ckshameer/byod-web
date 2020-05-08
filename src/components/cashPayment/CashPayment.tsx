import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

interface ICashPaymentState { }
interface ICashPaymentProps {
  onClose: () => void
}

class CashPayment extends Component<ICashPaymentProps, ICashPaymentState>{


  render() {
    return (
      <div className='selector-modal'>
        <div className='modal-header'>
          <div className="close-icon" onClick={this.props.onClose}>
            <FontAwesomeIcon icon={faTimes} size='lg' />
          </div>
          <p>Welcome to</p>
          <h1 className='item-name'>McDonalds</h1>
        </div>
        <div className='cashPayment'>
          <div className='payment-message'>
            <img src={require('../../assets/images/dine.png')} alt='DineIn' />
            <p>Food will start cooking only after you pay cash at the counter</p>
          </div>
          <div className='payment-actions'>
            <button className='primary-button'>Proceed</button>
            <button className='primary-button transparent'>Cancel</button>
          </div>
        </div>
      </div>
    )
  }
}
export default CashPayment
