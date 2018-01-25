import * as React from 'react'
import './CustomerService.less'

interface CustomerServiceProps {
  image: string
}

interface CustomerServiceState {

}

export class CustomerService extends React.Component<CustomerServiceProps, CustomerServiceState> {

  constructor() {
    super()
  }

  render() {
    const { image = 'https://static.iqycamp.com/images/kefu_2.png?imageslim' } = this.props

    return (
      <div className="customer-service-component">
        <img className="kefu-pic" src={image}
             onClick={() => _MEIQIA('showPanel')}/>
      </div>
    )
  }

}