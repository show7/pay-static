import * as React from 'react'
import './RedPurchaseButton.less'

export default class RedPurchaseButton extends React.Component {

  constructor () {
    super()
    this.state = {}
  }

  render () {
    const {
      onClick = () => {
      },
    } = this.props

    return (
      <div className="red-purchase-button-component">
        <div className="purchase-tip">
          <span className="common">坚持打卡学习 退全额学费（原价&nbsp;</span>
          <span className="remove">299</span>
          <span className="common"> ）</span>
          <span className="special">限时特价</span>
          <span className="super-special">99</span>
        </div>
        <div className="purchase-button"
             onClick={() => onClick()}>
          立即购买
        </div>
      </div>
    )
  }

}