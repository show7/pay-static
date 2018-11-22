import * as React from 'react'
import './SelfManage.less'
import { connect } from 'react-redux'
import { PayType } from '../../../utils/helpers'
import { joinChallengeAudio, checkAudio, checkCanPay } from '../async'
import { alertMsg } from '../../../redux/actions'
import { configShare } from '../../helpers/JsConfig'
import { mark } from 'utils/request'
import PayInfo from '../components/PayInfo'
import {payInfo} from '../components/PayInfo'

@connect(state => state)
export default class ChallengeAudio extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      saleImg: null,
      posterUrl: '',
      posterShow: false
    }
  }

  componentWillMount() {
    const { memo, source } = this.props.location.query
    mark({ module: '打点', function: '音频课入学', action: 'challengeaudio', memo, channelAudio: source })
    this.getInfo()
    configShare(
      `【圈外同学】请停止无效努力音频课`,
      `https://${window.location.hostname}/pay/challengeaudio`,
      'https://static.iqycamp.com/71527579350_-ze3vlyrx.pic_hd.jpg',
      `顶尖咨询总监，8年职场方法论`
    )
  }

  getInfo() {
    checkAudio('challenge_audio').then((res) => {
      if(res.code === 200) {
        let result = res.msg
        this.setState({
          isSubscribe: result.isSubscribe,
          price: result.price,
          qrCodeUrl: result.qrCodeUrl,
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
    mark({ module: '打点', function: '音频课入学', action: 'challengeaudio_click', channelAudio: source })
    joinChallengeAudio().then(res => {
      if(res.code === 200) {
        let result = res.msg
        this.setState({
          posterShow: true, posterUrl: result.url
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
    mark({ module: '打点', function: '音频课入学', action: 'challengepay_click', channelAudio: source })
    checkCanPay().then(res => {
      if(res.code === 200) {
        const { isSubscribe } = this.state
        if(isSubscribe) {
          this.refs.payInfo.handleClickOpen()
        } else {
          this.setState({
            subscribe: true
          })
        }
      } else {
        const { dispatch } = this.props
        dispatch(alertMsg(res.msg))
      }
    })
  }

  handlePayedDone() {
    mark({module: '打点', function: '自我管理专项课', action: '支付成功'})
    const {dispatch} = this.props
    dispatch(alertMsg('支付成功'))
  }

  /** 处理取消支付的状态 */
  handlePayedCancel(res) {
    const {dispatch} = this.props
    dispatch(alertMsg('已取消支付'))
  }

  /** 处理支付失败的状态 */
  handlePayedError(res) {
    const {dispatch} = this.props
    dispatch(alertMsg('支付失败'))
  }

  handlePayedBefore() {
    mark({module: '打点', function: '进阶课程', action: '点击付费'})
  }

  render() {
    const {
      saleImg,
      posterShow,
      posterUrl,
      subscribe,
      qrCodeUrl,
      goodsId,
      goodsName,
      goodsType
    } = this.state
    return (
      <div className='self-manage-container'>
        {
          saleImg && saleImg.map((item, index) => {
            return <img key={index} src={item} alt=""/>
          })
        }

        {
          posterShow && posterUrl &&
          <div className="poster-mask2">
            <div className="poster-box">
              <p>扫码添加班主任</p>
              <img className='posterPic' src={posterUrl} alt=""/>
              <img className='close'
                   onClick={() => {this.setState({ posterShow: false })}}
                   src="https://static.iqycamp.com/close-2-t6urec58.png" alt=""/>
            </div>
          </div>
        }
        <div className="bottom-button">
          <ul>
            <li onClick={() => {this.handlePayPopOut()}}>69元付费入学</li>
            <li onClick={() => {this.handleFreeEntry()}}>0元挑战</li>
          </ul>
        </div>
        {
          goodsId &&
          <PayInfo ref="payInfo" dispatch={this.props.dispatch} goodsType={goodsType}
                   goodsId={goodsId} header={goodsName} priceTips={} activityId={17} channel='challenge_audio'
                   payedDone={(goodsId) => this.handlePayedDone()}
                   payedCancel={(res) => this.handlePayedCancel(res)}
                   payedError={(res) => this.handlePayedError(res)}
                   payedBefore={() => this.handlePayedBefore()}
                   payType={ PayType.WECHAT}/>
        }
        {
          subscribe && qrCodeUrl &&
          <div className="subscribe-mask">
            <div className="qrCodeUrl-box">
              <p>你还没有关注公众号，请先扫码关注哦！</p>
              <img className='subscribe' src={qrCodeUrl} alt=""/>
              <img className='close'
                   onClick={() => {this.setState({ subscribe: false })}}
                   src="https://static.iqycamp.com/close-2-t6urec58.png" alt=""/>
            </div>
          </div>
        }
      </div>
    )
  }
}
