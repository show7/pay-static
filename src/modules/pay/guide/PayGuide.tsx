import * as React from 'react'
import CouponAlert from './components/CouponAlert/CouponAlert'
import AssetImg from '../../../components/AssetImg'
import { mark } from '../../../utils/request'
import { loadPersonalCoupons } from '../async'
import { configShare } from 'modules/helpers/JsConfig'

import './PayGuide.less'

export default class PayGuide extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  constructor() {
    super()
    this.state = {
      showCouponAlert: false,
      totalAmount: 0,
    }
  }

  async componentDidMount() {
    mark({ module: '打点', function: '售卖介绍页', action: '进入页面' })
    configShare(
      `【圈外同学】职场提升计划`,
      `https://${window.location.hostname}/pay/guide`,
      `https://static.iqycamp.com/71527579350_-ze3vlyrx.pic_hd.jpg`,
      `${window.ENV.userName}邀请你成为同学，每天30分钟，开启你的职场进阶之旅`
    )
    let couponsRes = await loadPersonalCoupons()
    if(couponsRes && couponsRes.code === 200 && parseInt(couponsRes.msg.total) > 0) {
      this.setState({
        showCouponAlert: true,
        totalAmount: couponsRes.msg.total,
      })
    }
  }

  handleClickGoL1() {
    mark({ module: '打点', function: '售卖介绍页', action: '点击 L1' })
    window.location.href = '/pay/l1'
  }

  handleClickGoL2() {
    mark({ module: '打点', function: '售卖介绍页', action: '点击 L2' })
    window.location.href = '/pay/rise'
  }

  handleClickGoL3() {
    mark({ module: '打点', function: '售卖介绍页', action: '点击 L3' })
    window.location.href = '/pay/thought'
  }

  handleHideAlert() {
    mark({ module: '打点', function: '售卖介绍页', action: '点击隐藏弹框' })
    this.setState({ showCouponAlert: false })
  }

  render() {
    const {
      showCouponAlert,
      totalAmount,
    } = this.state

    return (
      <div className="pay-guide-component">
        <AssetImg className="guide-img"
                  url="https://static.iqycamp.com/complex-guide-back-wpwp7y33.jpg"/>
        <div className="click-block click-block-l1"
             onClick={() => this.handleClickGoL1()}></div>
        <div className="click-block click-block-l2"
             onClick={() => this.handleClickGoL2()}></div>
        <div className="click-block click-block-l3"
             onClick={() => this.handleClickGoL3()}></div>
        {
          showCouponAlert &&
          <CouponAlert onClick={() => this.handleHideAlert()}
                       amount={totalAmount}/>
        }
      </div>
    )
  }

}