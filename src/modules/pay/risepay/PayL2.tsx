import * as React from 'react'
import * as _ from 'lodash'
import './PayL2.less'
import { connect } from 'react-redux'
import { mark } from 'utils/request'
import { PayType, sa, refreshForPay, saTrack } from 'utils/helpers'
import { set, startLoad, endLoad, alertMsg } from 'redux/actions'
import { config, configShare } from 'modules/helpers/JsConfig'
import PayInfo from '../components/PayInfo'
import { checkRiseMember, getRiseMember, loadInvitation, loadTask } from '../async'
import { SaleBody } from './components/SaleBody'
import { MarkBlock } from '../components/markblock/MarkBlock'
import { SubscribeAlert } from './components/SubscribeAlert'
import RenderInBody from '../../../components/RenderInBody'
import SaleShow from '../../../components/SaleShow'

@connect(state => state)
export default class PayL2 extends React.Component<any, any> {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor() {
    super()
    this.state = {
      goodsId: 10,
      timeOut: false,
      showErr: false,
      showCodeErr: false,
      subscribe: false,
      data: {},
      invitationLayout: false, // 弹框标识
      invitationData: {}, //分享的优惠券数据
      riseId: null,       //分享来源
      showShare: false, //不显示分享
      type: 0
    }
  }

  async componentWillMount() {
    // ios／安卓微信支付兼容性
    if(refreshForPay()) {
      return
    }
    const { dispatch } = this.props
    dispatch(startLoad())

    //表示是分享点击进入
    let { riseId, testPay } = this.props.location.query
    if(testPay == 'true') {
      this.setState({ testPay: true })
    }
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
    getRiseMember(this.state.goodsId).then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
        this.setState({ data: res.msg })
        const { quanwaiGoods = {} } = res.msg
        saTrack('openSalePayPage', {
          goodsType: quanwaiGoods.goodsType + '',
          goodsId: quanwaiGoods.id + '',
        })
        mark({ module: '打点', function: quanwaiGoods.goodsType, action: quanwaiGoods.id, memo: '入学页面' })
      } else {
        dispatch(alertMsg(res.msg))
      }
    }).catch((err) => {
      dispatch(endLoad())
      dispatch(alertMsg(err))
    })
    const { type = 0, taskId = 2 } = this.props.location.query;
    this.loadTask(taskId)
    if(type == 1) {
      this.setState({ showShare: true })
    }
  }

  /*获取值贡献*/
  loadTask(type) {
    loadTask(type).then((res) => {
      if(res.code == 200) {
        this.setState({ task: res.msg }, () => {
          configShare(
            `【圈外同学】企业实战训练，成为优秀的部门leader`,
            `https://${window.location.hostname}/pay/rise?riseId=${window.ENV.riseId}&type=2`,
            `https://static.iqycamp.com/71527579350_-ze3vlyrx.pic_hd.jpg`,
            `${window.ENV.userName}邀请你成为同学，领取${res.msg.shareAmount}元【圈外同学】L2项目入学优惠券`
          )
        })
      }
    })
  }

  /*投资圈外分享好友*/
  getsShowShare() {
    configShare(
      `【圈外同学】企业实战训练，成为优秀的部门leader`,
      `https://${window.location.hostname}/pay/rise?riseId=${window.ENV.riseId}&type=2`,
      `https://static.iqycamp.com/71527579350_-ze3vlyrx.pic_hd.jpg`,
      `${window.ENV.userName}邀请你成为同学，领取${this.state.task.shareAmount}元【圈外同学】L2项目入学优惠券`
    )
    mark({ module: '打点', function: '关闭弹框l2', action: '点击关闭弹框' })
    this.setState({ showShare: false, type: 1 })
  }

  handlePayedDone() {
    mark({ module: '打点', function: '商学院会员', action: '支付成功' })
    this.context.router.push({
      pathname: '/pay/member/success',
      query: {
        goodsId: 10
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
   * @param goodsId 会员类型id
   */
  handleClickOpenPayInfo(goodsId) {
    // this.reConfig()
    const { dispatch } = this.props
    const { riseId = '', type = 0 } = this.props.location.query
    dispatch(startLoad())
    // 先检查是否能够支付
    checkRiseMember(goodsId, riseId, type).then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
        const { qrCode, privilege, errorMsg, subscribe } = res.msg
        if(subscribe) {
          this.refs.payInfo.handleClickOpen()
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

  handlePayedBefore() {
    mark({ module: '打点', function: '商学院会员', action: '点击付费' })
  }

  /**
   * 重新注册页面签名
   */
  reConfig() {
    config([ 'chooseWXPay' ])
  }

  render() {
    const {
      testPay, data, timeOut, showErr, showCodeErr, subscribe,
      invitationLayout, invitationData,
      showQr, qrCode, showShare, type, task = {}
    } = this.state
    const { privilege, buttonStr, quanwaiGoods = {}, tip } = data
    const { shareAmount, shareContribution, finishContribution } = task
    const { location } = this.props
    let payType = _.get(location, 'query.paytype')

    const renderPay = () => {
      if(!quanwaiGoods) return null

      return (
        <div className="button-footer">
          <MarkBlock module={'打点'} func={'商学院会员'} action={'点击入学按钮'} memo={data ? buttonStr : ''}
                     className="footer-btn" onClick={() => this.handleClickOpenPayInfo(quanwaiGoods.id)}>
            {buttonStr || '立即入学'}
          </MarkBlock>

        </div>
      )

    }
    const renderLayout = () => {
      return (
        <div className="invitation-layout">
          <div className="layout-box">
            <h3>好友邀请</h3>
            <p>{invitationData.oldNickName}觉得《{invitationData.memberTypeName}》很适合你，邀请你成为TA的同学，送你一张{invitationData.amount}元的学习优惠券。</p>
            <span className="button" onClick={() => {
              this.setState({ invitationLayout: false })
            }}>知道了</span>
          </div>
        </div>
      )
    }

    return (
      <div className="rise-pay-container">
        <div className="pay-page l2">
          {quanwaiGoods.saleImg && <SaleShow showList={quanwaiGoods.saleImg} name='l2'/>}
          {/*<SaleBody memberTypeId="10"/>*/}
          {renderPay()}
        </div>
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
          quanwaiGoods &&
          <PayInfo ref="payInfo" dispatch={this.props.dispatch} goodsType={quanwaiGoods.goodsType}
                   goodsId={quanwaiGoods.id} header={quanwaiGoods.name} priceTips={tip}
                   payedDone={(goodsId) => this.handlePayedDone(goodsId)}
                   payedCancel={(res) => this.handlePayedCancel(res)}
                   payedError={(res) => this.handlePayedError(res)}
                   payedBefore={() => this.handlePayedBefore()}
                   payType={payType || PayType.WECHAT}
                   showHuabei={!!testPay}
                   showKfq={!!testPay}/>
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
              <span>请先扫码关注，“圈外同学”公众号，了解报名详情👇</span>
              <div className="qr_code">
                <img src={qrCode}/>
              </div>
            </div>
          </div>
        </RenderInBody> : null}
        {
          showShare &&
          <div className="share-mask-box">
            <dev className="share-content">
              <div className="share-content-top">
                <p>可赠送好友 <br/><span>{shareAmount}元</span><br/> L2项目入学优惠券 </p>
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
      </div>
    )
  }
}
