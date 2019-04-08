import React, { Component } from 'react'
import { connect } from 'react-redux'
import './PayL3.less'
import { set, startLoad, endLoad, alertMsg } from '../../../redux/actions'
import { getGoodsType, PayType, refreshForPay, sa } from '../../../utils/helpers'
import { checkRiseMember, getRiseMember, loadInvitation, loadTask } from '../async'
import { FooterButton } from '../../../components/submitbutton/FooterButton'
import InvitationLayout from '../components/invitationLayout/InvitationLayout'
import * as _ from 'lodash'
import PayInfo from '../components/PayInfo'
import { config, configShare } from '../../helpers/JsConfig'
import { mark } from '../../../utils/request'
import { SubscribeAlert } from './components/SubscribeAlert'
import RenderInBody from '../../../components/RenderInBody'
import SaleShow from '../../../components/SaleShow'

/**
 * 商业进阶课售卖页
 */
@connect(state => state)
export default class PayL3 extends Component<any, any> {
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
      riseId: '',       //分享来源
      showShare: false,  //不分享
      type: 0
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

    let amount = 0
    //分享优惠券
    const { riseId,markScene } = this.props.location.query
    if(markScene){
      mark({
        module: '打点',
        function: '普通打点链接',
        action: markScene,
        memo: riseId
      })
    }
    if(riseId) {
      let param = {
        riseId: riseId,
        memberTypeId: 8
      }

      let invitationInfo = await loadInvitation(param)
      this.setState({ invitationData: invitationInfo.msg })
      amount = invitationInfo.msg.amount
      if(amount!==0) {
        if(invitationInfo.msg.isNewUser && invitationInfo.msg.isReceived) {
          dispatch(alertMsg('优惠券已经发到你的圈外同学账号咯！'))
        } else if(invitationInfo.msg.isNewUser) {
          this.setState({ invitationLayout: true })
        }
      }
    }
    //表示是分享点击进入
    let res = await getRiseMember(this.state.showId)
    if(res.code === 200) {
      const { privilege, quanwaiGoods, tip, buttonStr, auditionStr, remainHour, remainMinute } = res.msg
      this.setState({ privilege, quanwaiGoods, tip, buttonStr, auditionStr, remainHour, remainMinute })

      mark({ module: '打点', function: quanwaiGoods.goodsType, action: quanwaiGoods.id, memo: '入学页面' })

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
    const { type = 0, taskId = 3 } = this.props.location.query
    this.loadTask(taskId);
    if(type == 1 && amount!==0) {
      this.setState({ showShare: true });
    }
  }

  /*获取值贡献*/
  loadTask(type) {
    loadTask(type).then((res) => {
      if(res.code == 200) {
        this.setState({ task: res.msg }, () => {
          configShare(
            `【圈外同学】哈佛案例教学，顶尖MBA名师授课`,
            `https://${window.location.hostname}/pay/thought?riseId=${window.ENV.riseId}&type=2`,
            `https://static.iqycamp.com/71527579350_-ze3vlyrx.pic_hd.jpg`,
            `${window.ENV.userName}邀请你成为同学，领取${res.msg.shareAmount}元【圈外同学】L3项目入学优惠券`
          )
        })
      }
    })
  }

  /*投资圈外分享好友*/
  getsShowShare() {
    configShare(
      `【圈外同学】哈佛案例教学，顶尖MBA名师授课`,
      `https://${window.location.hostname}/pay/thought?riseId=${window.ENV.riseId}&type=2`,
      `https://static.iqycamp.com/71527579350_-ze3vlyrx.pic_hd.jpg`,
      `${window.ENV.userName}邀请你成为同学，领取${this.state.task.shareAmount}元【圈外同学】L3项目入学优惠券`
    )
    mark({ module: '打点', function: '关闭弹框l3', action: '点击关闭弹框' })
    this.setState({ showShare: false, type: 1 })
  }

  redirect() {
    const { type } = this.props.location.query
    let param = { goodsId: 9 }
    if(type == 2) {
      Object.assign(param, { type: type })
    }
    this.context.router.push({
      pathname: '/pay/bsstart',
      query: param
    })
  }

  handlePayedDone() {
    mark({ module: '打点', function: '进阶课程', action: '支付成功' })
    this.context.router.push({
      pathname: '/pay/member/success',
      query: {
        goodsId: 8
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
    const { quanwaiGoods } = this.state
    mark({ module: '打点', function: '进阶课程', action: '点击付费', memo: quanwaiGoods.id })
  }

  /**
   * 打开支付窗口
   * @param showId 会员类型id
   */
  handleClickOpenPayInfo(showId) {
    this.reConfig()
    const { dispatch } = this.props
    dispatch(startLoad())
    const { riseId = '', type = 0 } = this.props.location.query
    // 先检查是否能够支付
    checkRiseMember(showId, riseId, type).then(res => {
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
          this.context.router.push({
            pathname: '/pay/oldBeltNew',
            query: {
              goodsId: showId
            },
          })
          // this.setState({ qrCode: qrCode, showQr: true })
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
    config([ 'chooseWXPay' ])
  }

  render() {
    let payType = _.get(location, 'query.paytype')

    const renderRightPayButton = ()=>{
      const {
        subscribeAlertTips, privilege, quanwaiGoods = {}, buttonStr, auditionStr, tip, showId, timeOut,
        showQr, qrCode,
        showErr, showCodeErr, subscribe, invitationLayout, invitationData, showShare, type, task = {}
      } = this.state
      if(!!privilege) {
        return <FooterButton primary={true} isThought={true} btnArray={[
          {
            click: () => this.handleClickOpenPayInfo(quanwaiGoods.id),
            text: '立即入学',
            module: '打点',
            func: '进阶课程',
            action: '点击立即入学',
            memo: '入学页面'
          }
        ]}/>
      } else {
        return <FooterButton primary={true} isThought={true} btnArray={[
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

    const {
      subscribeAlertTips, privilege, quanwaiGoods = {}, buttonStr, auditionStr, tip, showId, timeOut,
      showQr, qrCode,
      showErr, showCodeErr, subscribe, invitationLayout, invitationData, showShare, type, task = {}
    } = this.state
    const { shareAmount, shareContribution, finishContribution } = task
    const renderButtons = () => {
      if(typeof(privilege) === 'undefined') {
        return null
      }
      if(quanwaiGoods.stepPrice){
        return (
          <div className="button-footer step-wrapper">
            <div className="price-tips-wrapper">
              课程福利价: <span className="real-price">￥{quanwaiGoods.fee}  </span>（名额仅剩 <span className="remain">{quanwaiGoods.remain}个</span>）
            </div>
            {renderRightPayButton()}
          </div>
        )
      } else {
        if(!!privilege) {
          return <FooterButton primary={true} isThought={true} btnArray={[
            {
              click: () => this.handleClickOpenPayInfo(quanwaiGoods.id),
              text: '立即入学',
              module: '打点',
              func: '进阶课程',
              action: '点击立即入学',
              memo: '入学页面'
            }
          ]}/>
        } else {
          return <FooterButton primary={true} isThought={true} btnArray={[
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
    }
    return (
      <div className="plus-pay">
        {quanwaiGoods.saleImg && <SaleShow goods={quanwaiGoods} showList={quanwaiGoods.saleImg} name='l3'/>}
        {renderButtons()}
        {
          subscribe &&
          <SubscribeAlert tips={subscribeAlertTips.tips} qrCode={subscribeAlertTips.qrCode}
                          closeFunc={() => this.setState({ subscribe: false })}/>
        }
        {
          quanwaiGoods &&
          <PayInfo ref="payInfo" dispatch={this.props.dispatch} goodsType={quanwaiGoods.goodsType}
                   goodsId={quanwaiGoods.id} header={quanwaiGoods.name} priceTips={tip}
                   payedDone={(goodsId) => this.handlePayedDone()}
                   payedCancel={(res) => this.handlePayedCancel(res)}
                   payedError={(res) => this.handlePayedError(res)}
                   payedBefore={() => this.handlePayedBefore()}
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
          <div className="mask" onClick={() => {
            window.history.back()
          }}
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
        {(invitationLayout && quanwaiGoods.stepPrice) &&
        <InvitationLayout oldNickName={invitationData.oldNickName}
                          amount={invitationData.amount}
                          projectName={invitationData.memberTypeName}
                          callBack={() => {
                            this.setState({ invitationLayout: false })
                          }}/>
        }

        {
          showShare &&
          <div className="share-mask-box">
            <dev className="share-content">
              <div className="share-content-top">
                <p>可赠送好友 <br/><span>{shareAmount}元</span><br/> L3项目入学优惠券 </p>
              </div>
              <div className="share-content-bottom">
                <div><span>1</span><p className='desc'>好友成功入学，你将获得{shareContribution}贡献值</p></div>
                <div><span>2</span><p className='desc'>好友在开学1个月内按进度学习并完课，你将获得{finishContribution}贡献值</p>
                </div>
                <div className="button-bottom" onClick={() => {
                  this.getsShowShare()
                }}><p>立即邀请</p></div>
              </div>
            </dev>
          </div>
        }
        {
          type == 1 &&
          <div className="type-share">
            <img src="https://static.iqycamp.com/1091533182527_-sc42kog6.pic.jpg" alt="分享图片"/>
          </div>
        }
        {!!showQr ? <RenderInBody>
          <div className="qr_dialog">
            <div className="qr_dialog_mask"
                 onClick={() => {
                   this.setState({ showQr: false })
                 }}></div>
            <div className="qr_dialog_content">
              <span>请先扫码关注，“圈外同学”公众号，了解报名详情👇</span>
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
