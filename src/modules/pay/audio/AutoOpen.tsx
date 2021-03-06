import * as React from 'react'
import './AudioCourse.less'
import { connect } from 'react-redux'
import { loadActivityCheck, autoJoinAudioCourse } from '../async'
import { alertMsg } from '../../../redux/actions'
import { mark } from 'utils/request'
import { Dialog } from 'react-weui'

@connect(state => state)
export default class AutoOpen extends React.Component<any, any> {
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
      show: false,
      msg: '',
      isShow: false
    }
  }

  componentWillMount() {
    mark({ module: '打点', function: '音频课入学', action: '进入页面' })
    this.getInfo()
  }

  getInfo() {
    const { riseId = null } = this.props.location.query
    let param = riseId ? Object.assign({}, { riseId: riseId }) : {}
    loadActivityCheck(17, param).then(res => {
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
        // if (!this.state.isCanBuy) {
        //   if (this.state.isSubscribe) {
        //     window.location.replace(
        //       `/rise/static/plan/study?planId=${result.memberPlanId}`
        //     )
        //   } else {
        //     this.context.router.push(
        //       `/pay/audioPaySuccess?goodsId=${this.state.goodsId}`
        //     )
        //   }
        // }
        // this.setState({
        //   isShow: true
        // })
      }
    })
  }

  /**
   * 点击免费入学
   */
  handleFreeEntry() {
    mark({ module: '打点', function: '音频课入学', action: '自动开课' })
    autoJoinAudioCourse().then(res => {
      this.setState({ msg: res.msg, show: true })
    })
  }

  render() {
    const { saleImg, show, msg, isShow } = this.state
    return (
      <div
        className="self-manage-container"
        style={{ display: isShow ? 'block' : 'none' }}
      >
        {saleImg &&
          saleImg.map((item, index) => {
            return <img key={index} src={item} alt="" />
          })}

        <Dialog
          show={show}
          buttons={[
            {
              label: '去上课',
              onClick: () => {
                window.location.href =
                  '/rise/activity/static/promotion/audio?activityId=13'
              }
            }
          ]}
        >
          {msg}
        </Dialog>

        <div className="bottom-button">
          <ul>
            <li
              style={{
                width: '100%',
                background: 'rgba(61,81,137,1)',
                color: 'rgba(255,255,255,1)'
              }}
              onClick={() => {
                this.handleFreeEntry()
              }}
            >
              点击开课
            </li>
          </ul>
        </div>
      </div>
    )
  }
}
