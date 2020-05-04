import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

interface EnsureAuthenticatedState {
  loggedIn: boolean;
  loading: boolean;
}

class EnsureAuthenticated extends Component<{}, EnsureAuthenticatedState>{

  constructor(props: any) {
    super(props)
    this.state = {
      loggedIn: false,
      loading: true,
    }
  }
  componentDidMount() {
    const locationId = localStorage.getItem('locationId')
    if (!locationId) {
      this.setState({ loggedIn: false, loading: false })
    } else {
      this.setState({ loggedIn: true, loading: false })
    }
  }

  render() {
    if (!this.state.loading && !this.state.loggedIn) {
      return (
        <Redirect to={'/qr'} />
      )
    }
    return (
      <div>
        {!this.state.loading && this.props.children}
      </div>
    )
  }
}
export default EnsureAuthenticated
