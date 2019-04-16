import * as React from 'react'
import './ActivityCourse.less'
import { connect } from 'react-redux'
import { loadActivityCheck, joinAudioCourse } from '../async'
import { alertMsg } from '../../../redux/actions'
import { configShare } from '../../helpers/JsConfig'
import { mark } from 'utils/request'
import Icon from '../../../components/Icon'
@connect(state => state)
export default class ActivityCourse extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      isCanBuy: true,
      isSubscribe: true,
      price: 49,
      qrCodeUrl: '',
      saleImg: null,
      content: '',
      posterUrl: '',
      posterShow: false,
      subscribe: false,
      needMember: 0,
      canClick: true,
      isShow: true,
      isSHowActive: false,
      isBuyed: false,
      isSHowTopic: false
    }
  }

  componentWillMount() {
    const { source, markScene, riseId } = this.props.location.query
    if (markScene) {
      mark({
        module: '打点',
        function: '普通打点链接',
        action: markScene,
        memo: riseId
      })
    }
    mark({
      module: '打点',
      function: '音频课入学',
      action: 'wondercv',
      memo: source
    })
    this.getInfo()
    configShare(
      `【圈外同学】请停止无效努力音频课`,
      `https://${window.location.hostname}/pay/audiocourse?riseId=${
        window.ENV.riseId
      }&type=2`,
      'https://static.iqycamp.com/71527579350_-ze3vlyrx.pic_hd.jpg',
      `顶尖咨询总监，8年职场方法论`
    )
  }

  getInfo() {
    const { riseId = null } = this.props.location.query
    let param = riseId ? Object.assign({}, { riseId: riseId }) : {}
    loadActivityCheck(21, param).then(res => {
      if (res.code === 200) {
        let result = res.msg
        this.setState({
          isCanBuy: result.isCanBuy,
          isSubscribe: result.isSubscribe,
          price: result.price,
          qrCodeUrl: result.qrCodeUrl,
          goodsId: result.goodsId,
          goodsName: result.goodsName,
          goodsType: result.goodsType,
          saleImg: result.saleImg,
          needMember: result.needMember,
          isBuyed: !result.isCanBuy,
          isSHowActive: true
        })
        if (result.isCanBuy === true) {
        }
        this.setState({
          isShow: true
        })
      }
    })
  }

  /**
   * 点击免费入学
   */
  handleFreeEntry() {
    if (!this.state.canClick) return
    this.setState({
      canClick: false
    })
    let {
      source = 'normal_audio',
      activityId = null,
      msgId = null
    } = this.props.location.query
    mark({ module: '打点', function: '音频课入学', action: 'wondercv_click' })
    activityId = Number(activityId) ? Number(activityId) : null
    msgId = Number(msgId) ? Number(msgId) : null
    joinAudioCourse({ source, activityId, msgId }).then(res => {
      this.setState({
        canClick: true
      })
      if (res.code === 200) {
        let result = res.msg
        this.setState({
          posterShow: true,
          posterUrl: result.url,
          isSHowActive: true,
          isSHowTopic: true
        })
      } else {
        const { dispatch } = this.props
        dispatch(alertMsg(res.msg))
      }
    })
  }
  closeShow() {
    this.setState({
      isSHowActive: false
    })
  }
  closeTopic() {
    this.setState({
      isSHowTopic: false
    })
  }
  render() {
    const {
      saleImg,
      posterShow,
      posterUrl,
      isShow,
      isSHowActive,
      isBuyed,
      isSHowTopic
    } = this.state
    const { type } = this.props.location.query
    return (
      <div
        className="self-manage-container"
        style={{ display: isShow ? 'block' : 'none' }}
      >
        {saleImg &&
          saleImg.map((item, index) => {
            return <img key={index} src={item} alt="" />
          })}

        {type == 1 && (
          <div className="type-share">
            <img
              src="https://static.iqycamp.com/1091533182527_-sc42kog6.pic.jpg"
              alt="分享图片"
            />
          </div>
        )}
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
        <div className="bottom-button">
          <ul>
            <li
              style={{
                width: '100%',
                background:
                  'linear-gradient(270deg,rgba(165,230,40,1) 0%,rgba(125,190,0,1) 100%)',
                color: 'rgba(255,255,255,1)'
              }}
              onClick={() => {
                this.handleFreeEntry()
              }}
            >
              免费领取
              {/* <span style={{ fontSize: '13' }}>（原价199元）</span> */}
            </li>
          </ul>
        </div>
        {isSHowActive && !isBuyed && (
          <div className="activeMask">
            <div className="toastContent">
              <img src="https://static.iqycamp.com/toast1-okzkrcit.png" />
              <div className="closeImg" onClick={() => this.closeShow()}>
                <Icon type="close" size="3rem" />
              </div>
            </div>
          </div>
        )}
        {isSHowActive && isBuyed && (
          <div className="activeMask">
            <div className="toastContent">
              <img src="https://static.iqycamp.com/toast2-vt7f3shj.png" />
              <div className="closeImg" onClick={() => this.closeShow()}>
                <Icon type="close" size="3rem" />
              </div>
            </div>
          </div>
        )}
        {isSHowTopic && (
          <div className="activeMask">
            <div className="toastContent notice">
              <div className="title">领书活动已结束</div>
              <img className="qrcode" src="" />
              <div className="topic">
                <p>您可以长按保存图片</p>
                <p>分享并关注「又更新了」公众号</p>
                <p>成功邀请一人即可获得一份资料包。</p>
                <div className="closeImg" onClick={() => this.closeTopic()}>
                  <Icon type="close" size="3rem" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}
