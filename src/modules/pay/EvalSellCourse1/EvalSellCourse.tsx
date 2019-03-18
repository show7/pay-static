import * as React from 'react'
import * as _ from 'lodash'
import './Evalsellcourse.less'
import {connect} from 'react-redux'
import {mark} from 'utils/request'
import {PayType, sa, refreshForPay, saTrack} from 'utils/helpers'
import {set, startLoad, endLoad, alertMsg} from 'redux/actions'
import {config, configShare} from 'modules/helpers/JsConfig'
import PayInfo from '../components/PayInfo'
import {
  checkRiseMember,
  getRiseMember,
  loadInvitation,
  loadTask,
} from '../async'
import {MarkBlock} from '../components/markblock/MarkBlock'
import {SubscribeAlert} from '../risepay/components/SubscribeAlert'
import InvitationLayout from '../components/invitationLayout/InvitationLayout'
import RenderInBody from '../../../components/RenderInBody'
import SaleShow from '../../../components/SaleShow'
import {getQuery} from '../../../utils/getquery'

@connect(state => state)
export default class evalSellCourse extends React.Component<any, any> {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }
  constructor() {
    super()
    this.state = {
      goodsId: 12,
      showErr: false,
      showCodeErr: false,
      subscribe: false,
      data: {},
      invitationLayout: false, // 弹框标识
      showShare: false,
      type: 0,
    }
  }

  componentDidMount() {
    this.setState(
      {
        goodsId: getQuery('goodsId') || '',
      },
      () => {
        const {goodsId} = this.state
        console.log(goodsId)
        // ios／安卓微信支付兼容性
        if (refreshForPay()) {
          return
        }
        const {dispatch} = this.props
        dispatch(startLoad())
        // 查询订单信息
        getRiseMember(this.state.goodsId)
        .then(res => {
          dispatch(endLoad())
          if (res.code === 200) {
            this.setState({data: res.msg})
            const {quanwaiGoods = {}} = res.msg
            this.configShare(quanwaiGoods.id, quanwaiGoods.name)
            saTrack('openSalePayPage', {
              goodsType: quanwaiGoods.goodsType + '',
              goodsId: quanwaiGoods.id + '',
            })
            mark({
              module: '打点',
              function: quanwaiGoods.goodsType,
              action: quanwaiGoods.id,
              memo: '课程售卖页面曝光点',
            })
          } else {
            dispatch(alertMsg(res.msg))
          }
        })
        .catch(err => {
          dispatch(endLoad())
          dispatch(alertMsg(err))
        })
      }
    )
  }
  configShare(goodsId, goodsName) {
    configShare(
      goodsName,
      `https://${
        window.location.hostname
        }/pay/evalSellCourse?goodsId=${goodsId}`,
      'https://static.iqycamp.com/images/rise_share.jpg?imageslim',
      `我发现了一门好课，分享给你。现在还有早鸟价，快来看看吧！`
    )
  }
  // componentDidMount() {
  // TODO 设置分享
  // configShare(
  //   `圈外商学院--你负责努力，我们负责帮你赢`,
  //   `https://${window.location.hostname}/pay/rise`,
  //   'https://static.iqycamp.com/images/rise_share.jpg?imageslim',
  //   '最实用的竞争力提升课程，搭建最优质的人脉圈，解决最困扰的职场难题'
  // )
  // }

  handlePayedDone() {
    const {data} = this.state
    const {quanwaiGoods = {}} = data
    mark({
      module: '打点',
      function: '课程售卖页',
      action: '支付成功',
      memo: quanwaiGoods.id,
    })
    this.context.router.push({
      pathname: '/pay/member/success',
      query: {
        goodsId: quanwaiGoods.id,
      },
    })
  }

  /** 处理支付失败的状态 */
  handlePayedError(res) {
    let param = _.get(res, 'err_desc', _.get(res, 'errMsg', ''))
    if (param.indexOf('跨公众号发起') != -1) {
      // 跨公众号
      this.setState({showCodeErr: true})
    } else {
      this.setState({showErr: true})
    }
  }

  /** 处理取消支付的状态 */
  handlePayedCancel() {
    this.setState({showErr: true})
  }

  /**
   * 打开支付窗口
   * @param goodsId 会员类型id
   */
  handleClickOpenPayInfo(goodsId) {
    const {dispatch} = this.props
    const {data} = this.state
    const {privilege, errorMsg} = data
    if (!privilege && !!errorMsg) {
      dispatch(alertMsg(errorMsg))
      return
    }
    const {riseId = '', type = 0} = this.props.location.query

    this.reConfig()
    dispatch(startLoad())
    // 先检查是否能够支付
    checkRiseMember(goodsId, riseId, type)
    .then(res => {
      dispatch(endLoad())
      if (res.code === 200) {
        const {qrCode, privilege, errorMsg, subscribe} = res.msg
        if (subscribe) {
          if (privilege) {
            this.refs.payInfo.handleClickOpen()
          } else {
            dispatch(alertMsg(errorMsg))
          }
        } else {
          this.setState({qrCode: qrCode, showQr: true})
        }
      } else {
        dispatch(alertMsg(res.msg))
      }
    })
    .catch(ex => {
      dispatch(endLoad())
      dispatch(alertMsg(ex))
    })
  }

  handlePayedBefore() {
    const {data} = this.state
    const {quanwaiGoods = {}} = data
    mark({
      module: '打点',
      function: '课程售卖页',
      action: '点击付费',
      memo: quanwaiGoods.id,
    })
  }

  /**
   * 重新注册页面签名
   */
  reConfig() {
    config(['chooseWXPay'])
  }

  render() {
    const {
      data,
      showErr,
      showCodeErr,
      subscribe,
      goodsId,
      invitationLayout,
      showQr,
      qrCode,
      invitationData,
      showShare,
      type,
      task = {},
    } = this.state
    const {privilege, quanwaiGoods = {}, tip} = data
    const {shareAmount, shareContribution, finishContribution} = task
    const {location} = this.props
    let payType = _.get(location, 'query.paytype')

    const renderPay = () => {
      if (!quanwaiGoods.id) return null
      return (
        <div className="button-footer">
          <MarkBlock
            module={'打点'}
            func={quanwaiGoods.id}
            action={'点击入学按钮'}
            memo={privilege}
            className="footer-btn"
            onClick={() => this.handleClickOpenPayInfo(quanwaiGoods.id)}
          >
            立即入学
          </MarkBlock>
        </div>
      )
    }

    return (
      <div className="rise-pay-container">
        <div className="pay-page">
          {quanwaiGoods.saleImg && (
            <SaleShow showList={quanwaiGoods.saleImg} name="l1" />
          )}
          {renderPay()}
        </div>
        {showErr && (
          <div className="mask" onClick={() => this.setState({showErr: false})}>
            <div className="tips">
              出现问题的童鞋看这里
              <br /> 1如果显示“URL未注册”，请重新刷新页面即可
              <br />{' '}
              2如果遇到“支付问题”，扫码联系招生办老师，并将出现问题的截图发给招生办老师
              <br />
            </div>
            <img
              className="xiaoQ"
              src="https://static.iqycamp.com/images/code_zsbzr_0703.jpeg?imageslim"
            />
          </div>
        )}
        {showCodeErr && (
          <div
            className="mask"
            onClick={() => this.setState({showCodeErr: false})}
          >
            <div className="tips">
              糟糕，支付不成功
              <br /> 原因：微信不支持跨公众号支付
              <br /> 怎么解决：
              <br /> 1，长按下方二维码，保存到相册；
              <br /> 2，打开微信扫一扫，点击右上角相册，选择二维码图片；
              <br />
              3，在新开的页面完成支付即可
              <br />
            </div>
            <img
              className="xiaoQ"
              style={{width: '50%'}}
              src="https://static.iqycamp.com/images/code_zsbzr_0703.jpeg?imageslim"
            />
          </div>
        )}
        {quanwaiGoods && (
          <PayInfo
            ref="payInfo"
            dispatch={this.props.dispatch}
            goodsType={quanwaiGoods.goodsType}
            goodsId={quanwaiGoods.id}
            header={quanwaiGoods.name}
            priceTips={tip}
            payedDone={goodsId => this.handlePayedDone(goodsId)}
            payedCancel={res => this.handlePayedCancel(res)}
            payedError={res => this.handlePayedError(res)}
            payedBefore={() => this.handlePayedBefore()}
            payType={payType || PayType.WECHAT}
          />
        )}
        {subscribe && (
          <SubscribeAlert closeFunc={() => this.setState({subscribe: false})} />
        )}

        {invitationLayout && (
          <InvitationLayout
            oldNickName={invitationData.oldNickName}
            amount={invitationData.amount}
            projectName={invitationData.memberTypeName}
            callBack={() => {
              this.setState({invitationLayout: false})
            }}
          />
        )}
        {!!showQr ? (
          <RenderInBody>
            <div className="qr_dialog">
              <div
                className="qr_dialog_mask"
                onClick={() => {
                  this.setState({showQr: false})
                }}
              />
              <div className="qr_dialog_content">
                <span>请先扫码关注，“圈外同学”公众号，了解报名详情👇</span>
                <div className="qr_code">
                  <img src={qrCode} />
                </div>
              </div>
            </div>
          </RenderInBody>
        ) : null}
        {showShare && (
          <div className="share-mask-box">
            <dev className="share-content">
              <div className="share-content-top">
                <p>
                  可赠送好友 <br />
                  <span>{shareAmount}元</span>
                  <br /> L1项目入学优惠券{' '}
                </p>
              </div>
              <div className="share-content-bottom">
                <div>
                  <span>1</span>
                  <p className="desc">
                    好友成功入学，你将获得{shareContribution}贡献值
                  </p>
                </div>
                <div>
                  <span>2</span>
                  <p className="desc">
                    好友在开学1个月内按进度学习并完课，你将获得
                    {finishContribution}贡献值
                  </p>
                </div>
                <div
                  className="button-bottom"
                  onClick={() => {
                    this.getsShowShare()
                  }}
                >
                  <p>立即邀请</p>
                </div>
              </div>
            </dev>
          </div>
        )}
        {type == 1 && (
          <div className="type-share">
            <img
              src="https://static.iqycamp.com/1091533182527_-sc42kog6.pic.jpg"
              alt="分享图片"
            />
          </div>
        )}
      </div>
    )
  }
}
