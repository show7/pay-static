import React, { Component } from 'react'
import { connect } from 'react-redux'
import './ThoughtPay.less'
import { set, startLoad, endLoad, alertMsg } from 'redux/actions'
import { getGoodsType, PayType, refreshForPay, sa } from '../../../utils/helpers'
import { checkRiseMember, getRiseMember, loadInvitation } from '../async'
import { SaleBody } from '../risepay/components/SaleBody'
import { FooterButton } from '../../../components/submitbutton/FooterButton'
import InvitationLayout from '../components/invitationLayout/InvitationLayout'
import * as _ from 'lodash'
import PayInfo from '../components/PayInfo'
import { config } from '../../helpers/JsConfig'
import { mark } from 'utils/request'
import { SubscribeAlert } from '../risepay/components/SubscribeAlert'

/**
 * 商业进阶课售卖页
 */
@connect(state => state)
export default class ThoughtPay extends Component<any, any> {
  constructor() {
    super()
    this.state = {
      showId: 8,
      subscribeAlertTips: {
        tips: <div>
          长按扫码添加<br/>
          圈外招生办老师（ID：iquanwai-iqw）<br/>
          回复【商业项目】，领取学习资料包！</div>,
        qrCode: 'https://static.iqycamp.com/images/qrcode_qwzswyh.jpeg?imageslim'
      },
      invitationLayout: false, // 弹框标识
      invitationData: {}, //分享的优惠券数据
      riseId: ''        //分享来源
    }
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  async componentWillMount() {
    const { dispatch } = this.props
    if(refreshForPay()) {
      return
    }
    //分享优惠券
    const { riseId } = this.props.location.query
    if(riseId) {
      let param = {
        riseId: riseId,
        memberTypeId: 8
      }
      let invitationInfo = await loadInvitation(param)
      this.setState({ invitationData: invitationInfo.msg })
      if(invitationInfo.msg.isNewUser && invitationInfo.msg.isReceived) {
        dispatch(alertMsg('优惠券已经发到你的圈外同学账号咯！'))
      } else if(invitationInfo.msg.isNewUser) {
        this.setState({ invitationLayout: true })
      }
    }
    //表示是分享点击进入
    let res = await getRiseMember(this.state.showId)
    if(res.code === 200) {
      const { privilege, memberType, tip, buttonStr, auditionStr, remainHour, remainMinute } = res.msg
      this.setState({ privilege, memberType, tip, buttonStr, auditionStr, remainHour, remainMinute })
      // 进行打点
      if(privilege) {
        sa.track('openSalePayPage', {
          goodsType: getGoodsType(this.state.showId),
          goodsId: this.state.showId + ''
        })
        mark({ module: '打点', function: '进阶课程', action: '购买进阶课程会员', memo: '入学页面', promotionRiseId: riseId })
      } else {
        // window.location.href = '/rise/static/rise';
        // return;
        sa.track('openSaleApplyPage', {
          goodsType: getGoodsType(this.state.showId),
          goodsId: this.state.showId + ''
        })
        mark({ module: '打点', function: '进阶课程', action: '购买进阶课程会员', memo: '申请页面', promotionRiseId: riseId })
      }
    }
  }

  redirect() {
    this.context.router.push({
      pathname: '/pay/bsstart',
      query: {
        goodsId: 9
      }
    })
  }

  handlePayedDone() {
    mark({ module: '打点', function: '进阶课程', action: '支付成功' })
    this.context.router.push({
      pathname: '/pay/member/success',
      query: {
        memberTypeId: 8
      }
    })
  }

  /** 处理取消支付的状态 */
  handlePayedCancel(res) {
    this.setState({ showErr: true })
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

  handlePayedBefore() {
    mark({ module: '打点', function: '进阶课程', action: '点击付费' })
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
        const { qrCode, privilege, errorMsg } = res.msg
        if(privilege) {
          this.refs.payInfo.handleClickOpen()
        } else {
          dispatch(alertMsg(errorMsg))
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

  /**
   * 重新注册页面签名
   */
  reConfig() {
    config(['chooseWXPay'])
  }

  render() {
    let payType = _.get(location, 'query.paytype')

    const { subscribeAlertTips, privilege, memberType, buttonStr, auditionStr, tip, showId, timeOut, showErr, showCodeErr, subscribe, invitationLayout, invitationData } = this.state
    const renderButtons = () => {
      if(typeof(privilege) === 'undefined') {
        return null
      }
      if(!!privilege) {
        return <FooterButton primary={true} btnArray={[
          {
            click: () => this.handleClickOpenPayInfo(memberType.id),
            text: '立即入学',
            module: '打点',
            func: '进阶课程',
            action: '点击立即入学',
            memo: '入学页面'
          }
        ]}/>
      } else {
        return <FooterButton primary={true} btnArray={[
          {
            click: () => this.redirect(),
            text: '马上申请',
            module: '打点',
            func: '进阶课程',
            action: '点击马上预约',
            memo: '申请页面'
          }
        ]}/>
      }
    }
    return (
      <div className="plus-pay">
        <SaleBody memberTypeId='8'/>
        {renderButtons()}
        {
          subscribe &&
          <SubscribeAlert tips={subscribeAlertTips.tips} qrCode={subscribeAlertTips.qrCode}
                          closeFunc={() => this.setState({ subscribe: false })}/>
        }
        {
          memberType &&
          <PayInfo ref="payInfo" dispatch={this.props.dispatch} goodsType={getGoodsType(memberType.id)}
                   goodsId={memberType.id} header={memberType.name} priceTips={tip}
                   payedDone={(goodsId) => this.handlePayedDone()} payedCancel={(res) => this.handlePayedCancel(res)}
                   payedError={(res) => this.handlePayedError(res)} payedBefore={() => this.handlePayedBefore()}
                   payType={payType || PayType.WECHAT}/>
        }
        {
          showCodeErr &&
          <div className="mask" onClick={() => this.setState({ showCodeErr: false })}>
            <div className="tips">
              糟糕，支付不成功<br/> 原因：微信不支持跨公众号支付<br/> 怎么解决：<br/> 1，长按下方二维码，保存到相册；<br/> 2，打开微信扫一扫，点击右上角相册，选择二维码图片；<br/>
              3，在新开的页面完成支付即可<br/>
            </div>
            <img className="xiaoQ" style={{ width: '50%' }}
                 src="https://static.iqycamp.com/images/fragment/thought_apply_pro.jpeg?imageslim"/>
          </div>
        }
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
        {invitationLayout &&
        <InvitationLayout oldNickName={invitationData.oldNickName}
                          amount={invitationData.amount}
                          prijectName={invitationData.memberTypeName}
                          callBack={() => {this.setState({ invitationLayout: false })}}/>
        }
      </div>
    )
  }
}
