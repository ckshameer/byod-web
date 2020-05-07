import React, { Component } from 'react'
import { StripeProvider, Elements } from 'react-stripe-elements'
import CardForm from './CardForm'

interface IStripePaymentState { }
interface IStripePaymentProps { }


export default class StripePayment extends Component<IStripePaymentProps, IStripePaymentState>{
  componentDidMount() {
  }

  render() {
    return (
      <>
        <StripeProvider apiKey='pk_test_ABtpMqrqzavLueu25NhPC67C00JD0yuZY9'>
          <Elements>
            <CardForm/>
          </Elements>
        </StripeProvider>
      </>
    )
  }
}
