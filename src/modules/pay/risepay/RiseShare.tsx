import * as React from 'react'
import './RisePay.less'
import { connect } from 'react-redux'
import { ppost, pget, mark } from 'utils/request'
import { set, startLoad, endLoad, alertMsg } from 'redux/actions'
import { config, configShare } from 'modules/helpers/JsConfig'
import { SaleBody } from './components/SaleBody'
import { MarkBlock } from '../components/markblock/MarkBlock'

@connect(state => state)
export default class RiseShare extends React.Component<any, any> {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor() {
    super()
    this.state = {
      showTip: false
    }
  }

  componentWillMount() {
    mark({ module: '打点', func: '商学院会员', action: '分享页面' })
  }

  componentDidMount() {
    configShare(
      `圈外商学院--你负责努力，我们负责帮你赢`,
      `https://${window.location.hostname}/pay/static/rise`,
      'https://static.iqycamp.com/images/rise_share.jpg?imageslim',
      '最实用的竞争力提升课程，搭建最优质的人脉圈，解决最困扰的职场难题')
  }

  handleShare() {
    this.setState({ showTip: true })
  }

  render() {
    const { showTip } = this.state

    const renderPay = () => {
      return (
        <div className="pay-page">
          <SaleBody/>
          <div className="button-footer">
            <MarkBlock module={'打点'} func={'商学院会员'} action={'点击转发按钮'}
                       className={'footer-btn'}>
              转发
            </MarkBlock>
          </div>
        </div>
      )
    }

    return (
      <div className="rise-pay-container">
        {renderPay()}
        {
          showTip ?
            <div className="share-tip" onClick={() => this.setState({ showTip: false })}>
              <div className="tip-pic">
                <img src="https://static.iqycamp.com/images/share_pic1.png" width={247}/>
              </div>
            </div>
            : null
        }
      </div>
    )
  }
}
