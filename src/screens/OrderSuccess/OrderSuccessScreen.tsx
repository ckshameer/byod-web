import React, { Component } from 'react'

class OrderSuccessScreen extends Component {
  render() {
    return (
      <div className='screen orderSuccess-screen'>
        <div className='orderSuccess-message'>
          <h1>Thank you</h1>
          <p>Please wait until your number is called</p>
        </div>
        <div className='orderToken-container'>
          <p>Your token number is:</p>
          <h1>12345</h1>
        </div>
      </div>
    )
  }
}
export default OrderSuccessScreen
