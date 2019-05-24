import * as React from 'react';
import './AudioPay.less'
import { connect } from 'react-redux'
import { PayType } from '../../../utils/helpers'
import { checkAudioV2, checkAudio, checkCanPay, loadRotate, checkGoodsInfo } from '../async'
import { alertMsg } from '../../../redux/actions'
import { Alert } from '../../../components/alert/Alert'
import { Dialog } from '../../../components/dialog/Dialog'
import { configShare } from '../../helpers/JsConfig'
import { mark } from 'utils/request'
import PayInfo from '../components/PayInfo'
import * as _ from 'lodash'
import Icon from '../../../components/Icon'
import { DataFormat } from '../../../components/DataFormate'

@connect(state => state)
export default class AudioPay extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      isCanBuy: true,
      saleImg: null,
      posterUrl: '',
      posterShow: false,
      surplus: Math.round(Math.random() * (299 - 255)) + 255,
      cooldown: 0,
      downTime: 600000,
      showModal: false,
      showModal2: false,
      alert: {
        title: '',
        buttons: [
          {
            type: 'default',
            label: '不报了',
            onClick: () => this.setState({ showModal: false })
          },
          {
            type: 'primary',
            label: '去报名',
            onClick: () => {
              this.setState({ showModal: false })
              this.handleFreeEntry()
            }
          }
        ]
      },
      showAlert: {
        buttons: [
          {
            label: '确定',
            onClick: () => this.reload()
          }
        ]
      },
      isSubscribe: true,
      canClick: true,
      isShow: false,
      fee: null,
      initPrice: null
    }
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  reload() {
    const { source, goodsId, channelSource } = this.props.location.query
    window.location.href = `/pay/audiopay?random=${Math.random()}&goodsId=${goodsId}` + (source ? `&source=${source}` : '') + (channelSource ? `&channelSource=${channelSource}` : '')
  }

  async componentWillMount() {
    const { source, goodsId, channelSource } = this.props.location.query
    mark({
      module: '打点',
      function: 'audiopay',
      action: goodsId + '',
      memo: source
    })

    mark({
      module: '打点',
      function: '音频课投放',
      action: goodsId + '',
      memo: channelSource
    })
    let res = await checkAudioV2(goodsId)
    if(res.code === 200) {
      let result = res.msg
      this.setState({
        price: result.price,
        goodsId: result.goodsId,
        goodsName: result.goodsName,
        goodsType: result.goodsType,
        saleImg: result.saleImg,
        isCanBuy: result.isCanBuy,
        isSubscribe: result.isSubscribe,
        memberPlanId: result.memberPlanId
      })
      if(result.isCanBuy === false) {
        if(result.isPaid === true) {
          if(result.isSubscribe) {
            if(result.memberPlanId) {
              window.location.replace(
                `/rise/static/plan/study?planId=${result.memberPlanId}`
              )
            } else {
              window.location.replace(
                '/rise/activity/static/promotion/audio?activityId=13'
              )
            }
          } else {
            window.location.replace(
              `/pay/audioPaySuccess?goodsId=${this.state.goodsId}`
            )
          }
        } else {
          if(result.memberPlanId) {
            window.location.replace(
              `/rise/static/plan/study?planId=${result.memberPlanId}`
            )
          } else {
            window.location.replace(
              '/rise/activity/static/promotion/audio?activityId=13'
            )
          }
        }
      } else {
        this.setState({
          isShow: true
        })
        let _timer = setInterval(() => {
          if(this.state.downTime <= 0) {
            clearInterval(_timer)
            return
          }
          this.state.downTime -= 5
          this.setState({
            cooldown: DataFormat(this.state.downTime)
          })
        }, 5)
        let _number = setInterval(() => {
          this.state.surplus =
            this.state.surplus - (Math.round(Math.random() * (5 - 3)) + 3) <= 0
              ? 0
              : this.state.surplus - (Math.round(Math.random() * (5 - 3)) + 3)
          if(this.state.surplus <= 0) {
            clearInterval(_number)
            this.setState({
              showModal: true
            })
          }
        }, 1000 * 3)
      }
    }
    configShare(
      `【圈外同学】个人发展策略音频课`,
      `https://${window.location.hostname}/pay/audiopay?goodsId=32`,
      'https://static.iqycamp.com/71527579350_-ze3vlyrx.pic_hd.jpg',
      `顶尖咨询总监，8年职场方法论`
    )
  }

  /**
   * 点击免费入学
   */
  handleFreeEntry() {
    if(!this.state.canClick) return
    this.setState({
      canClick: false
    })
    const { source, goodsId } = this.props.location.query
    mark({
      module: '打点',
      function: '音频课入学',
      action: 'coinaudio_click_1',
      memo: source
    })
    let _this = this
    checkCanPay().then(res => {
      if(res.code === 200) {
        if(_.isEmpty(res.msg)) {
          checkGoodsInfo(goodsId).then(res => {
            this.setState({
              canClick: true
            })
            if(res.code === 200) {
              let result = res.msg
              this.setState(
                {
                  price: result.price,
                  goodsId: result.id,
                  goodsName: result.name,
                  goodsType: result.goodsType
                },
                () => {
                  _this.refs.payInfo.handleClickOpen()
                }
              )
            }
          })
        } else {
          this.setState({
            posterUrl: res.msg,
            posterShow: true
          })
        }
      } else {
        const { dispatch } = this.props
        dispatch(alertMsg(res.msg))
      }
    })
  }

  /*点击购买*/
  handlePayPopOut() {
    const { source, goodsId } = this.props.location.query
    mark({
      module: '打点',
      function: '音频课入学',
      action: 'coinaudiopay_click_2',
      memo: source
    })
    let _this = this
    checkCanPay().then(res => {
      if(res.code === 200) {
        if(_.isEmpty(res.msg)) {
          checkGoodsInfo(goodsId).then(res => {
            if(res.code === 200) {
              let result = res.msg
              this.setState(
                {
                  price: result.price,
                  goodsId: result.id,
                  goodsName: result.name,
                  goodsType: result.goodsType
                },
                () => {
                  _this.refs.payInfo.handleClickOpen()
                }
              )
            }
          })
        } else {
          this.setState({
            posterUrl: res.msg,
            posterShow: true
          })
        }
      } else {
        const { dispatch } = this.props
        dispatch(alertMsg(res.msg))
      }
    })
  }

  handlePayedDone() {
    mark({ module: '打点', function: '付费报名', action: '支付成功' })
    if(this.state.isSubscribe) {
      window.location.replace(
        `/rise/static/plan/study?planId=${this.state.memberPlanId}`
      )
    } else {
      this.context.router.push(
        `/pay/audioPaySuccess?goodsId=${this.state.goodsId}`
      )
    }
  }

  /** 处理取消支付的状态 */
  handlePayedCancel(res) {
    this.setState({
      showModal2: true
    })
  }

  /** 处理支付失败的状态 */
  handlePayedError(res) {
    const { dispatch } = this.props
    dispatch(alertMsg('支付失败'))
  }

  handlePayedBefore() {
    mark({ module: '打点', function: '进阶课程', action: '点击付费' })
  }

  setPrice(fee, initPrice) {
    this.setState({
      fee: fee,
      initPrice: initPrice
    })
  }

  render() {

    const { source, channelSource } = this.props.location.query


    const {
      saleImg,
      posterShow,
      posterUrl,
      goodsId,
      goodsName,
      goodsType,
      surplus,
      cooldown,
      isShow,
      fee,
      initPrice
    } = this.state
    return (
      <div
        className="coin-audio-container"
        style={{ display: isShow ? 'block' : 'none' }}
      >
        {saleImg &&
        saleImg.map((item, index) => {
          return <img key={index} src={item} alt=""/>
        })}
        {posterShow && posterUrl && (
          <div className="poster-mask2">
            <div className="poster-box">
              <p>扫码添加班主任，才能正常开课！</p>
              <p>（不添加班主任无法开课）</p>
              <img className="posterPic" src={posterUrl} alt=""/>
              <img
                className="close"
                onClick={() => {
                  this.setState({ posterShow: false })
                }}
                src="https://static.iqycamp.com/close-2-t6urec58.png"
                alt=""
              />
            </div>
          </div>
        )}

        <div className="audio-bottom-button">
          <div className="numberContent">
            <div className="surplus">
              <Icon type="time" size="1.2rem"/>
              <div className="surplusText">本期剩余：{surplus}个名额</div>
            </div>
            <div>距结束还有：{cooldown}</div>
          </div>
          <div className="priceContent">
            <div className="leftContent">
              <div className="nowPrice">
                ￥<span>{Number(fee) ? fee.toFixed(2) : null}</span>
              </div>
              <del style={{ display: Number(initPrice) ? 'block' : 'none' }}>
                原价￥{Number(initPrice) ? initPrice.toFixed(2) : null}
              </del>
            </div>
            <div
              className="rightContent"
              onClick={() => this.handleFreeEntry()}
            >
              <div className="signText">立即报名></div>
            </div>
          </div>
        </div>
        <Alert
          text="本期名额已抢完，确认进入下一期"
          btnText="确定"
          callBack={() => this.reload()}
          show={this.state.showModal}
        />
        <Dialog
          text="真的要放弃报名吗？"
          btnText1="去报名"
          btnText2="不报名"
          callBack1={() => this.setState({ showModal2: false })}
          callBack2={() => {
            this.setState({ showModal2: false })
            this.handlePayPopOut()
          }}
          show={this.state.showModal2}
        />
        {goodsId && (
          <PayInfo
            ref="payInfo"
            dispatch={this.props.dispatch}
            goodsType={goodsType}
            goodsId={goodsId}
            header={goodsName}
            priceTips={}
            activityId={17}
            channel={channelSource || "new_28_rotate"}
            payedDone={() => this.handlePayedDone()}
            payedCancel={res => this.handlePayedCancel(res)}
            payedError={res => this.handlePayedError(res)}
            payedBefore={() => this.handlePayedBefore()}
            payType={PayType.WECHAT}
            setPrice={(fee, initPrice) => this.setPrice(fee, initPrice)}
          />
        )}
      </div>
    )
  }
}
