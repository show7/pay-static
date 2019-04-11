import * as React from 'react'
import './CoinAudioPay.less'
import { connect } from 'react-redux'
import { PayType } from '../../../utils/helpers'
import { checkAudio, checkCanPay, loadRotate, checkGoodsInfo } from '../async'
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
export default class CoinAudioPay extends React.Component<any, any> {
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
      isShow: false
    }
  }
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }
  reload() {
    window.location.href = '/pay/coinaudio?random=' + Math.random()
  }
  async componentWillMount() {
    const { source } = this.props.location.query
    mark({
      module: '打点',
      function: '音频课入学',
      action: 'coinaudio',
      memo: source
    })
    let res = await checkAudio('coin_audio')
    if (res.code === 200) {
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
      if (result.isCanBuy === false) {
        if (result.isSubscribe) {
          window.location.replace(
            `/rise/static/plan/study?planId=${result.memberPlanId}`
          )
        } else {
          window.location.replace(
            `/pay/audioPaySuccess?goodsId=${this.state.goodsId}`
          )
        }
      } else {
        this.setState({
          isShow: true
        })
        let _timer = setInterval(() => {
          if (this.state.downTime <= 0) {
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
          if (this.state.surplus <= 0) {
            clearInterval(_number)
            this.setState({
              showModal: true
            })
          }
        }, 1000 * 3)
      }
    }
    configShare(
      `【圈外同学】请停止无效努力音频课`,
      `https://${window.location.hostname}/pay/coinaudio`,
      'https://static.iqycamp.com/71527579350_-ze3vlyrx.pic_hd.jpg',
      `顶尖咨询总监，8年职场方法论`
    )
  }

  /**
   * 点击免费入学
   */
  handleFreeEntry() {
    if (!this.state.canClick) return
    this.setState({
      canClick: false
    })
    const { source } = this.props.location.query
    mark({
      module: '打点',
      function: '音频课入学',
      action: 'coinaudio_click_1',
      memo: source
    })
    let _this = this
    checkCanPay().then(res => {
      if (res.code === 200) {
        if (_.isEmpty(res.msg)) {
          checkGoodsInfo(21).then(res => {
            this.setState({
              canClick: true
            })
            if (res.code === 200) {
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
    const { source } = this.props.location.query
    mark({
      module: '打点',
      function: '音频课入学',
      action: 'coinaudiopay_click_2',
      memo: source
    })
    let _this = this
    checkCanPay().then(res => {
      if (res.code === 200) {
        if (_.isEmpty(res.msg)) {
          checkGoodsInfo(22).then(res => {
            if (res.code === 200) {
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
    loadRotate(13).then(res => {
      if (res.code === 200) {
        if (this.state.isSubscribe) {
          window.location.replace(
            `/rise/static/plan/study?planId=${this.state.memberPlanId}`
          )
        } else {
          this.context.router.push(
            `/pay/audioPaySuccess?goodsId=${this.state.goodsId}`
          )
        }
      }
    })
  }

  /** 处理取消支付的状态 */
  handlePayedCancel(res) {
    // const { dispatch } = this.props
    // dispatch(alertMsg('已取消支付'))
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

  render() {
    const {
      saleImg,
      posterShow,
      posterUrl,
      goodsId,
      goodsName,
      goodsType,
      surplus,
      cooldown,
      isShow
    } = this.state
    return (
      <div
        className="coin-audio-container"
        style={{ display: isShow ? 'block' : 'none' }}
      >
        {saleImg &&
          saleImg.map((item, index) => {
            return <img key={index} src={item} alt="" />
          })}
        {posterShow && posterUrl && (
          <div className="poster-mask2">
            <div className="poster-box">
              <p>扫码添加班主任，才能正常开课！</p>
              <p>（不添加班主任无法开课）</p>
              <img className="posterPic" src={posterUrl} alt="" />
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
          {/* <ul>
            <li onClick={() => {this.handlePayPopOut()}}>69元付费入学</li>
            <li onClick={() => {this.handleFreeEntry()}}>1元挑战入学</li>
          </ul> */}
          <div className="numberContent">
            <div className="surplus">
              <Icon type="time" size="1.2rem" />
              <div className="surplusText">本期剩余：{surplus}个名额</div>
            </div>
            <div>距结束还有：{cooldown}</div>
          </div>
          <div className="priceContent">
            <div className="leftContent">
              <div className="nowPrice">
                ￥<span>1.00</span>
              </div>
              <del>原价￥199.00</del>
            </div>
            <div
              className="rightContent"
              onClick={() => this.handleFreeEntry()}
            >
              <div className="signText">立即报名></div>
            </div>
          </div>
          {/* <div className="leftContent">
            <div className="nowPrice">
              <span>￥</span>9.00
            </div>
            <div>
              <del>￥199.00</del>
              <div className="surplus">剩余：{surplus}</div>
            </div>
          </div>
          <div className="rightContent" onClick={() => this.handleFreeEntry()}>
            <div>
              <div className="signText">立即报名</div>
              <div className="cooldown">
                <Icon type="time" size="1.2rem" />
                {cooldown}
              </div>
            </div>
          </div> */}
        </div>
        {/* <Dialog {...this.state.alert} show={this.state.showModal}>
          真的要放弃报名吗？
        </Dialog>
        <Dialog {...this.state.showAlert} show={this.state.showModal2}>
          本期名额已抢完，确认进入下一期
        </Dialog> */}
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
            channel="coin_audio"
            payedDone={goodsId => this.handlePayedDone()}
            payedCancel={res => this.handlePayedCancel(res)}
            payedError={res => this.handlePayedError(res)}
            payedBefore={() => this.handlePayedBefore()}
            payType={PayType.WECHAT}
          />
        )}
      </div>
    )
  }
}
