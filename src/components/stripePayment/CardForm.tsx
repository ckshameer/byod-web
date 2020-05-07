import React, { Component } from 'react'
import { injectStripe, CardElement, ReactStripeElements } from 'react-stripe-elements'


class CardForm extends Component<any, IFormState>{
  constructor(props: IFormProps) {
    super(props)
    this.state = {
      name: '',
      amount: ''
    }
  }
  async handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      let token = await this.props.stripe?.createToken({ name: this.state.name })
      console.log(token)
    } catch (e) {
      throw e
    }
  }
  render() {
    return (
      <main className='container'>
        <form
          className="form-group mt-3 border border-primary rounded shadow-lg"
          onSubmit={(e: React.ChangeEvent<HTMLFormElement>) => this.handleSubmit(e)}
        >
          <label>Name</label>
          <input
            type='text'
            className='input-group my-1 p-1 border border-dark'
            value={this.state.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ name: e.target.value })}
          ></input>
          <label>Amount</label>
          <input
            type='text'
            className='input-group my-1 p-1 border border-dark'
            value={this.state.amount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ amount: e.target.value })}
          ></input>
          <label>Card Details</label>
          <CardElement />
          <button >Pay Now</button>
        </form>
      </main>
    )
  }
}
interface IFormProps extends ReactStripeElements.InjectedStripeProps { }
interface IFormState {
  name: string
  amount: string
}

export default injectStripe(CardForm)
