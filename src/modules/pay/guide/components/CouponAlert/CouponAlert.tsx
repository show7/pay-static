import * as React from 'react'
import Mask from '../../../../../components/mask/Mask'

import './CouponAlert.less'

/**
 * 售卖综合员，优惠券指示弹框
 */
export default class CouponAlert extends React.Component {

  constructor () {
    super()
  }

  render () {
    const {
      onClick = () => {
      },
      amount = 0,
    } = this.props

    return (
      <div className="coupon-alert-component">
        <div className="coupon-alert-block"
             onClick={() => onClick()}>
          <div className="alert-content">
            <span className="symbol">￥</span><span className="amount">{amount}</span>
          </div>
        </div>
        <Mask/>
      </div>
    )
  }

}