import * as React from 'react'
import './AudioCourse.less'
import { connect } from 'react-redux'
import { loadActivityCheck, joinAudioCourse } from '../async'
import { alertMsg } from '../../../redux/actions'
import { configShare } from '../../helpers/JsConfig'
import { mark } from 'utils/request'

@connect(state => state)
export default class AudioCourse extends React.Component<any, any> {
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
      isShow: true
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
          needMember: result.needMember
        })
        if (result.isCanBuy === false) {
          if (result.isPaid === true) {
            if (result.isSubscribe) {
              if (result.memberPlanId) {
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
            if (result.memberPlanId) {
              window.location.replace(
                `/rise/static/plan/study?planId=${result.memberPlanId}`
              )
            } else {
              window.location.replace(
                '/rise/activity/static/promotion/audio?activityId=13'
              )
            }
          }
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
    const { source = 'normal_audio', riseId = null } = this.props.location.query
    mark({ module: '打点', function: '音频课入学', action: 'wondercv_click' })
    joinAudioCourse({ source, riseId }).then(res => {
      this.setState({
        canClick: true
      })
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

  render() {
    const { saleImg, posterShow, posterUrl, isShow } = this.state
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
              免费入学
              <span style={{ fontSize: '13' }}>（原价199元）</span>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}
