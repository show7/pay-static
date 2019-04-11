import * as React from 'react'
import './ChallengeAudio.less'
import { connect } from 'react-redux'
import { PayType } from '../../../utils/helpers'
import {
  joinChallengeAudio,
  checkAudio,
  checkCanPay,
  loadRotate
} from '../async'
import { alertMsg } from '../../../redux/actions'
import { configShare } from '../../helpers/JsConfig'
import { mark } from 'utils/request'
import PayInfo from '../components/PayInfo'
import { payInfo } from '../components/PayInfo'
import * as _ from 'lodash'

@connect(state => state)
export default class ChallengeAudio extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      saleImg: null,
      posterUrl: '',
      posterShow: false,
      isCanBuy: true,
      isSubscribe: true,
      isShow: false
    }
  }

  componentWillMount() {
    const { source } = this.props.location.query
    mark({
      module: '打点',
      function: '音频课入学',
      action: 'challengeaudio',
      memo: source
    })
    this.getInfo()
    configShare(
      `【圈外同学】请停止无效努力音频课`,
      `https://${window.location.hostname}/pay/challengeaudio`,
      'https://static.iqycamp.com/71527579350_-ze3vlyrx.pic_hd.jpg',
      `顶尖咨询总监，8年职场方法论`
    )
  }

  getInfo() {
    checkAudio('challenge_audio').then(res => {
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
          isShow: true
        })
        if (!this.state.isCanBuy) {
          if (this.state.isSubscribe) {
            window.location.replace(
              `/rise/static/plan/study?planId=${result.memberPlanId}`
            )
          } else {
            this.context.router.push(
              `/pay/audioPaySuccess?goodsId=${this.state.goodsId}`
            )
          }
        }
      }
    })
  }

  /**
   * 点击免费入学
   */
  handleFreeEntry() {
    let { source = 'challenge_audio' } = this.props.location.query
    mark({
      module: '打点',
      function: '音频课入学',
      action: 'challengeaudio_click',
      memo: source
    })
    joinChallengeAudio(source).then(res => {
      if (res.code === 200) {
        let result = res.msg
        this.setState({
          posterShow: true,
          posterUrl: result.url
        })
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
      action: 'challengepay_click',
      memo: source
    })
    checkCanPay().then(res => {
      if (res.code === 200) {
        if (_.isEmpty(res.msg)) {
          this.refs.payInfo.handleClickOpen()
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
    const { source } = this.props.location.query
    mark({
      module: '打点',
      function: '69元付费报名',
      action: '支付成功',
      memo: source
    })
    loadRotate(13).then(res => {
      if (res.code === 200) {
        this.setState({
          posterUrl: res.msg,
          posterShow: true
        })
      }
    })
  }

  /** 处理取消支付的状态 */
  handlePayedCancel(res) {
    const { dispatch } = this.props
    dispatch(alertMsg('已取消支付'))
  }

  /** 处理支付失败的状态 */
  handlePayedError(res) {
    const { dispatch } = this.props
    dispatch(alertMsg('支付失败'))
  }

  handlePayedBefore() {
    const { source } = this.props.location.query
    mark({
      module: '打点',
      function: '进阶课程',
      action: '点击付费',
      memo: source
    })
  }

  render() {
    const {
      saleImg,
      posterShow,
      posterUrl,
      goodsId,
      goodsName,
      goodsType,
      isShow
    } = this.state
    return (
      <div
        className="challenge-audio-container"
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
          <ul>
            <li
              onClick={() => {
                this.handlePayPopOut()
              }}
            >
              199元付费入学
            </li>
            <li
              onClick={() => {
                this.handleFreeEntry()
              }}
            >
              0元挑战入学
            </li>
          </ul>
        </div>
        {goodsId && (
          <PayInfo
            ref="payInfo"
            dispatch={this.props.dispatch}
            goodsType={goodsType}
            goodsId={goodsId}
            header={goodsName}
            priceTips={}
            activityId={17}
            channel="challenge_audio"
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
