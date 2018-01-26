import * as React from 'react'
import './CustomerService.less'

interface CustomerServiceProps {
  image: string,
  componentStyle?: string
}

interface CustomerServiceState {

}

export class CustomerService extends React.Component<CustomerServiceProps, CustomerServiceState> {

  constructor() {
    super()
  }

  componentDidUpdate() {
    const { componentStyle } = this.props
    if(componentStyle) {
      if(this.refs.kefu_service) {
        this.refs.kefu_service.classList.add(componentStyle)
      }
    }
  }

  render() {
    const { image = 'https://static.iqycamp.com/images/kefu_2.png?imageslim' } = this.props
    return (
      <div className="customer-service-component" ref="kefu_service">
        <img className="kefu-pic" src={image}
             onClick={() => _MEIQIA('showPanel')}/>
      </div>
    )
  }

}