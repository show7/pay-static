import * as React from 'react'
import './AudioPaySuccess.less'
import { connect } from 'react-redux'
import { set, startLoad, endLoad, alertMsg } from '../../../redux/actions'
import { entryRiseMember } from '../async'
import { mark } from 'utils/request'
@connect(state => state)
export default class MemberPaySuccess extends React.Component<any, any> {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor() {
    super()
    this.state = {
      entryCode: '',
      goodsName: '',
      operateUrl: '',
      headTeacherNickName: '',
      openDate: '',
      wechatPublicUrl: ''
    }

    this.pd = (50 / 750) * window.innerWidth
    this.topPd = (90 / 500) * window.innerWidth
  }

  componentWillMount() {
    const { dispatch } = this.props
    const { goodsId } = this.props.location.query
    dispatch(startLoad())
    // 查询订单信息
    entryRiseMember(goodsId)
      .then(res => {
        dispatch(endLoad())
        if (res.code === 200) {
          const {
            entryCode,
            goodsName,
            operateUrl,
            headTeacherNickName,
            openDate,
            wechatPublicUrl
          } = res.msg
          mark({
            module: '购课落地页',
            function: '支付页',
            action: '支付成功页面（曝光点）',
            memo: `entryCode=${entryCode}&goodsName=${goodsName}`
          })
          this.setState({
            entryCode,
            goodsName,
            operateUrl,
            headTeacherNickName,
            openDate,
            wechatPublicUrl
          })
        } else {
          dispatch(alertMsg(res.msg))
        }
      })
      .catch(ex => {
        dispatch(endLoad())
        dispatch(alertMsg(ex))
      })
  }

  render() {
    const {
      entryCode,
      goodsName,
      operateUrl,
      headTeacherNickName,
      openDate,
      wechatPublicUrl
    } = this.state

    const classmatesCode = () => {
      return (
        <img src={wechatPublicUrl} alt="圈外同学服务号" className="qrcode" />
      )
    }

    return (
      <div className="pay-success">
        {/* <div className="gutter" style={{height: `${this.topPd}px`}} /> */}
        <div className="user-header">
          <img src={window.ENV.headImgUrl} alt="" />
        </div>
        <div className="pay-sucess-text align-center">恭喜你成功报名</div>
        <div className="pay-sucess-goods-name align-center">{goodsName}</div>
        <div className="goods-start-time align-center">
          开学日期：{openDate ? openDate.replace(/-/g, '.') : ''}
        </div>
        {/* <div className="success-tips">
          Hi, {window.ENV.userName}，欢迎加入{goodsName}
        </div> */}
        <div className="step-wrapper">
          <div className="content">
            <div className="notice">
              请长按识别下方二维码关注“圈外职场学院”服务号，我们将在服务号为您提供教学服务，并推送上课时间。
            </div>
            <div className="qrcodeContent">{classmatesCode()}</div>
            <div className="study-help align-center">
              遇到问题可以通过以下方式联系教学负责人：
              <br />
              18916208045(工作日：10:00-18:00)
            </div>
          </div>
        </div>
      </div>
    )
  }
}
