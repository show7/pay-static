import * as React from 'react'
import * as _ from 'lodash'
import './RisePay.less'
import { connect } from 'react-redux'
import { mark } from 'utils/request'
import { PayType, sa, refreshForPay, saTrack } from 'utils/helpers'
import { set, startLoad, endLoad, alertMsg } from 'redux/actions'
import { config, configShare } from 'modules/helpers/JsConfig'
import PayInfo from '../components/PayInfo'
import { checkRiseMember, getRiseMember, loadInvitation } from '../async'
import { SaleBody } from './components/SaleBody'
import { MarkBlock } from '../components/markblock/MarkBlock'
import { addUserRecommendation } from './async'
import { SubscribeAlert } from './components/SubscribeAlert'
import RenderInBody from '../../../components/RenderInBody'

@connect(state => state)
export default class RisePay extends React.Component<any, any> {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor() {
    super()
    this.state = {
      showId: 10,
      timeOut: false,
      showErr: false,
      showCodeErr: false,
      subscribe: false,
      data: {},
      invitationLayout: false, // 弹框标识
      invitationData: {}, //分享的优惠券数据
      riseId: null        //分享来源
    }
  }

  async componentWillMount() {
    // ios／安卓微信支付兼容性
    if(refreshForPay()) {
      return
    }
    const { dispatch } = this.props
    dispatch(startLoad())

    const id = this.props.location.query.riseId
    //表示是分享点击进入
    let { riseId } = this.props.location.query
    //判断是否是老带新分享的链接
    if(!_.isEmpty(riseId)) {
      let param = {
        riseId: riseId,
        memberTypeId: 10
      }
      let invitationInfo = await loadInvitation(param)
      this.setState({ invitationData: invitationInfo.msg })
      this.setState({ invitationData: invitationInfo.msg })
      if(invitationInfo.msg.isNewUser && invitationInfo.msg.isReceived) {
        dispatch(alertMsg('优惠券已经发到你的圈外同学账号咯！'))
      } else if(invitationInfo.msg.isNewUser) {
        this.setState({ invitationLayout: true })
      }
    }
    // 查询订单信息
    getRiseMember(this.state.showId).then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
        this.setState({ data: res.msg })
        const { memberType = {} } = res.msg
        const { privilege } = res.msg
        if(privilege) {
          saTrack('openSalePayPage', {
            goodsType: memberType.goodsType + '',
            goodsId: memberType.id + ''
          })
          mark({ module: '打点', function: memberType.goodsType, action: memberType.id, memo: '入学页面' })
        } else {
          saTrack('openSaleApplyPage', {
            goodsType: memberType.goodsType + '',
            goodsId: memberType.id + ''
          })
          mark({ module: '打点', function: memberType.goodsType, action: memberType.id, memo: '申请页面' })
        }
      } else {
        dispatch(alertMsg(res.msg))
      }
    }).catch((err) => {
      dispatch(endLoad())
      dispatch(alertMsg(err))
    })
  }

  componentDidMount() {
    configShare(
      `圈外商学院--你负责努力，我们负责帮你赢`,
      `https://${window.location.hostname}/pay/static/rise`,
      'https://static.iqycamp.com/images/rise_share.jpg?imageslim',
      '最实用的竞争力提升课程，搭建最优质的人脉圈，解决最困扰的职场难题'
    )
  }

  handlePayedDone() {
    mark({ module: '打点', function: '商学院会员', action: '支付成功' })
    this.context.router.push({
      pathname: '/pay/member/success',
      query: {
        memberTypeId: 10
      }
    })
  }

  /** 处理支付失败的状态 */
  handlePayedError(res) {
    let param = _.get(res, 'err_desc', _.get(res, 'errMsg', ''))
    if(param.indexOf('跨公众号发起') != -1) {
      // 跨公众号
      this.setState({ showCodeErr: true })
    } else {
      this.setState({ showErr: true })
    }
  }

  /** 处理取消支付的状态 */
  handlePayedCancel(res) {
    this.setState({ showErr: true })
  }

  /**
   * 打开支付窗口
   * @param showId 会员类型id
   */
  handleClickOpenPayInfo(showId) {
    this.reConfig()
    const { dispatch } = this.props
    dispatch(startLoad())
    // 先检查是否能够支付
    checkRiseMember(showId).then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
        const { qrCode, privilege, errorMsg, subscribe } = res.msg
        if(subscribe) {
          if(privilege) {
            this.refs.payInfo.handleClickOpen()
          } else {
            dispatch(alertMsg(errorMsg))
          }
        } else {
          this.setState({ qrCode: qrCode, showQr: true })
        }
      }
      else {
        dispatch(alertMsg(res.msg))
      }
    }).catch(ex => {
      dispatch(endLoad())
      dispatch(alertMsg(ex))
    })
  }

  redirect() {
    saTrack('clickApplyButton')

    this.context.router.push({
      pathname: '/pay/bsstart',
      query: {
        goodsId: 11
      }
    })
  }

  handlePayedBefore() {
    mark({ module: '打点', function: '商学院会员', action: '点击付费' })
  }

  /**
   * 重新注册页面签名
   */
  reConfig() {
    config(['chooseWXPay'])
  }

  render() {
    const { data, timeOut, showErr, showCodeErr, subscribe, invitationLayout, invitationData,showQr, qrCode} = this.state
    const { privilege, buttonStr, memberType = {}, tip } = data
    const { location } = this.props
    let payType = _.get(location, 'query.paytype')

    const renderPay = () => {
      if(!memberType) return null

      if(privilege) {
        return (
          <div className="button-footer">
            <MarkBlock module={'打点'} func={'商学院会员'} action={'点击入学按钮'} memo={data ? buttonStr : ''}
                       className="footer-btn" onClick={() => this.handleClickOpenPayInfo(memberType.id)}>
              {buttonStr || '立即入学'}
            </MarkBlock>

          </div>
        )
      } else {
        return (
          <div className="button-footer">
            <MarkBlock module={`打点`} func={`商学院会员`} action={`预约商学院`} className={`footer-btn`}
                       onClick={() => this.redirect()}>立即预约</MarkBlock>
          </div>
        )
      }

    }
    const renderLayout = () => {
      return (
        <div className="invitation-layout">
          <div className="layout-box">
            <h3>好友邀请</h3>
            <p>{invitationData.oldNickName}觉得《{invitationData.memberTypeName}》很适合你，邀请你成为TA的同学，送你一张{invitationData.amount}元的学习优惠券。</p>
            <span className="button" onClick={() => {this.setState({ invitationLayout: false })}}>知道了</span>
          </div>
        </div>
      )
    }
    return (
      <div className="rise-pay-container">
        <div className="pay-page l2">
          <SaleBody/>
          {renderPay()}
        </div>
        {
          timeOut &&
          <div className="mask" onClick={() => {window.history.back()}}
               style={{
                 background: 'url("https://static.iqycamp.com/images/riseMemberTimeOut.png?imageslim") center' +
                 ' center/100% 100%'
               }}/>
        }
        {
          showErr &&
          <div className="mask" onClick={() => this.setState({ showErr: false })}>
            <div className="tips">
              出现问题的童鞋看这里<br/> 1如果显示“URL未注册”，请重新刷新页面即可<br/> 2如果遇到“支付问题”，扫码联系小黑，并将出现问题的截图发给小黑<br/>
            </div>
            <img className="xiaoQ" src="https://static.iqycamp.com/images/asst_xiaohei.jpeg?imageslim"/>
          </div>
        }
        {
          showCodeErr &&
          <div className="mask" onClick={() => this.setState({ showCodeErr: false })}>
            <div className="tips">
              糟糕，支付不成功<br/> 原因：微信不支持跨公众号支付<br/> 怎么解决：<br/> 1，长按下方二维码，保存到相册；<br/> 2，打开微信扫一扫，点击右上角相册，选择二维码图片；<br/>
              3，在新开的页面完成支付即可<br/>
            </div>
            <img className="xiaoQ" style={{ width: '50%' }}
                 src="https://static.iqycamp.com/images/asst_xiaohei.jpeg?imageslim"/>
          </div>
        }
        {
          memberType &&
          <PayInfo ref="payInfo" dispatch={this.props.dispatch} goodsType={memberType.goodsType}
                   goodsId={memberType.id} header={memberType.name} priceTips={tip}
                   payedDone={(goodsId) => this.handlePayedDone(goodsId)}
                   payedCancel={(res) => this.handlePayedCancel(res)}
                   payedError={(res) => this.handlePayedError(res)} payedBefore={() => this.handlePayedBefore()}
                   payType={payType || PayType.WECHAT}/>
        }
        {
          subscribe && <SubscribeAlert closeFunc={() => this.setState({ subscribe: false })}/>
        }
        {invitationLayout &&
        renderLayout()
        }

        {!!showQr ? <RenderInBody>
          <div className="qr_dialog">
            <div className="qr_dialog_mask" onClick={() => {
              this.setState({ showQr: false })
            }}>
            </div>
            <div className="qr_dialog_content">
              <span>扫码后可进行申请哦</span>
              <div className="qr_code">
                <img src={qrCode}/>
              </div>
            </div>
          </div>
        </RenderInBody> : null}
      </div>
    )
  }
}
