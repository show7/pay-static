import * as React from 'react'
import './CoinAudioPay.less'
import { connect } from 'react-redux'
import { PayType } from '../../../utils/helpers'
import { checkAudio, checkCanPay, loadRotate, checkGoodsInfo } from '../async'
import { alertMsg } from '../../../redux/actions'
import { Dialog, ALert } from 'react-weui'
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
      }
    }
  }
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }
  reload() {
    window.location.href = '/pay/coinaudio?random=' + Math.random()
  }
  componentWillMount() {
    const { source } = this.props.location.query
    mark({
      module: '打点',
      function: '音频课入学',
      action: 'coinaudio',
      memo: source
    })
    this.getInfo()
    configShare(
      `【圈外同学】请停止无效努力音频课`,
      `https://${window.location.hostname}/pay/coinaudio`,
      'https://static.iqycamp.com/71527579350_-ze3vlyrx.pic_hd.jpg',
      `顶尖咨询总监，8年职场方法论`
    )
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
          showModal2: true
        })
      }
    }, 1000 * 3)
  }

  getInfo() {
    checkAudio('coin_audio').then(res => {
      if (res.code === 200) {
        let result = res.msg
        this.setState({
          price: result.price,
          goodsId: result.goodsId,
          goodsName: result.goodsName,
          goodsType: result.goodsType,
          saleImg: result.saleImg
        })
      }
    })
  }

  /**
   * 点击免费入学
   */
  handleFreeEntry() {
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
          checkGoodsInfo(21).then(res => {
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
        // this.setState({
        //   posterUrl: res.msg,
        //   posterShow: true
        // })
        this.context.router.push('/pay/member/success')
      }
    })
  }

  /** 处理取消支付的状态 */
  handlePayedCancel(res) {
    // const { dispatch } = this.props
    // dispatch(alertMsg('已取消支付'))
    this.setState({
      showModal: true
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
      cooldown
    } = this.state
    return (
      <div className="coin-audio-container">
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
          <div className="leftContent">
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
          </div>
        </div>
        <Dialog {...this.state.alert} show={this.state.showModal}>
          真的要放弃报名吗？
        </Dialog>
        <Dialog {...this.state.showAlert} show={this.state.showModal2}>
          本期名额已抢完，确认进入下一期
        </Dialog>
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
