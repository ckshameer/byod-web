import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { NormalSpinner } from '../../components/preloader/Preloaders'

interface QrLoginState {
  isLoading: boolean
}

interface QrLoginProps {

}

class QrLogin extends Component<RouteComponentProps<QrLoginProps>, QrLoginState> {
  constructor(props: RouteComponentProps<QrLoginProps>) {
    super(props)
    this.state = {
      isLoading: false,
    }
  }

  componentDidMount() {
    this.setState({ isLoading: true })
    const { locationId } = this.props.match.params as any
    if (locationId) {
      setTimeout(() => {
        this.setState({ isLoading: false })
        localStorage.setItem('locationId', locationId)
        this.props.history.push('/order')
      }, 1000);
    } else {
      this.setState({ isLoading: false })
    }
  }

  getLocationId() {
    const locationId = localStorage.getItem('locationId')
    return locationId
  }

  render() {
    const { isLoading } = this.state
    return (
      <div className='screen qrLogin'>
        {
          isLoading ?
            <NormalSpinner />
            :
            <div className='qr-invalid'>
              <img className='qr-img' src={require('../../assets/images/QR.png')} alt='Invalid QR'></img>
              {/* <img className='qr-img-overlay' src={require('../../assets/images/error-red.png')} alt='Invalid QR'></img> */}
              <p className='invalid-message'>QR Code Error <br /><span>Please try again.</span></p>
            </div>
        }
      </div>
    )
  }
}
export default QrLogin
