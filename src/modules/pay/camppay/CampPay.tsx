import * as React from 'react'

export default class CampPay extends React.Component<any, any> {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor() {
    super()
  }

  componentWillMount() {
     window.location.href = 'https://h5.youzan.com/v2/goods/2fmsfp2eo1zxo'
  }

  render() {
    return <div></div>
  }
}
