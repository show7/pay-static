import * as React from 'react'
import AssetImg from '../../../components/AssetImg'
import { mark } from '../../../utils/request'
import { configShare } from 'modules/helpers/JsConfig'

import './PayGuide.less'

export default class PayGuide extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  constructor () {
    super()
    this.state = {}
  }

  async componentDidMount () {
    mark({ module: '打点', function: '售卖介绍页', action: '进入页面' })
    const {riseId} = this.props.location.query
    let targetRiseId
    if(riseId){
      targetRiseId = riseId
    } else{
      targetRiseId = window.ENV.riseId
    }

    configShare(
      `【圈外同学】职场提升计划`,
      `https://${window.location.hostname}/pay/guide?riseId=${targetRiseId}&type=2`,
      `https://static.iqycamp.com/71527579350_-ze3vlyrx.pic_hd.jpg`,
      `每天30分钟，开启你的职场进阶之旅`,
    )
  }

  handleClickGoL1 () {
    const {riseId} = this.props.location.query
    let targetRiseId;
    mark({ module: '打点', function: '售卖介绍页', action: '点击 L1' })
    if(riseId){
      targetRiseId = riseId
    } else{
      targetRiseId = window.ENV.riseId
    }
    window.location.href = `/pay/l1?riseId=${targetRiseId}&type=2`
  }

  handleClickGoL2 () {
    const {riseId} = this.props.location.query
    let targetRiseId;
    if(riseId){
      targetRiseId = riseId
    } else{
      targetRiseId = window.ENV.riseId
    }
    mark({ module: '打点', function: '售卖介绍页', action: '点击 L2' })

    window.location.href = `/pay/rise?riseId=${targetRiseId}&type=2`
  }

  handleClickGoL3 () {
    const {riseId} = this.props.location.query
    let targetRiseId;
    if(riseId){
      targetRiseId = riseId
    } else{
      targetRiseId = window.ENV.riseId
    }
    mark({ module: '打点', function: '售卖介绍页', action: '点击 L3' })
    window.location.href = `/pay/thought?riseId=${targetRiseId}&type=2`
  }

  render () {
    const {} = this.state

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
      </div>
    )
  }

}
