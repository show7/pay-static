import * as React from 'react'
import './RisePay.less'
import { connect } from 'react-redux'
import { SaleBody } from './components/SaleBody'
import { set, startLoad, endLoad, alertMsg } from 'redux/actions'
import { configShare } from '../../helpers/JsConfig'
import { Dialog } from 'react-weui'
import { MarkBlock } from '../components/markblock/MarkBlock'
import { mark } from 'utils/request'
import { addUserRecommendation } from './async'

const { Alert } = Dialog

@connect(state => state)
export default class RiseApply extends React.Component<any, any> {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor() {
    super()
    this.state = {
      subscribe: true,
      show: false
    }
  }

  componentWillMount() {
    const id = this.props.location.query.riseId
    //表示是分享点击进入
    if(id) {
      mark({ module: '打点', function: '商学院guest', action: '购买商学院会员', memo: '通过分享途径' })
      addUserRecommendation(id)
    }
    else {
      mark({ module: '打点', function: '商学院guest', action: '购买商学院会员' })
    }
  }

  componentDidMount() {
    configShare(
      `圈外商学院--你负责努力，我们负责帮你赢`,
      `https://${window.location.hostname}/pay/static/rise`,
      'https://static.iqycamp.com/images/rise_share.jpg?imageslim',
      '最实用的竞争力提升课程，搭建最优质的人脉圈，解决最困扰的职场难题')
  }

  redirect() {
    window.location.href = `/pay/bsstart`
  }

  handleClickAudition() {
    this.context.router.push({
      pathname: '/pay/preacher'
    })
  }

  render() {
    const { show } = this.state
    const renderPay = () => {
      return (
        <div className="pay-page">
          <SaleBody/>
          <div className="button-footer">
            <MarkBlock module={'打点'} func={'商学院guest'} action={'申请商学院'}
                       className={'footer-left'} onClick={() => this.redirect()}>
              申请商学院
            </MarkBlock>
            <MarkBlock module={'打点'} func={'商学院会员'} action={'点击宣讲课按钮'}
                       className="footer-btn" onClick={() => this.handleClickAudition()}>
              <div className="audition">{'预约直播'}</div>
            </MarkBlock>
          </div>
        </div>
      )
    }

    return (
      <div className="rise-pay-container" onClick={() => this.setState({ show: false })}>
        <Alert show={show} title="扫码关注，完成预约">
          <img src="https://www.iqycamp.com/images/qrcode/audition_signup.jpeg" style={{ width: 160, height: 160 }}/>
        </Alert>
        {renderPay()}
      </div>
    )
  }
}
