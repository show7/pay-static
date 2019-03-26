import * as React from 'react'
import './MemberPaySuccess.less'
import {connect} from 'react-redux'
import {set, startLoad, endLoad, alertMsg} from '../../../redux/actions'
import {entryRiseMember} from '../async'

@connect(state => state)
export default class MemberPaySuccess extends React.Component<any, any> {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  constructor() {
    super()
    this.state = {
      entryCode: '',
      goodsName: '',
      operateUrl: '',
      headTeacherNickName: '',
      openDate: '',
      wechatPublicUrl: '',
    }

    this.pd = (50 / 750) * window.innerWidth
    this.topPd = (90 / 500) * window.innerWidth
  }

  componentWillMount() {
    const {dispatch} = this.props
    const {goodsId} = this.props.location.query
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
            wechatPublicUrl,
          } = res.msg
          this.setState({
            entryCode,
            goodsName,
            operateUrl,
            headTeacherNickName,
            openDate,
            wechatPublicUrl,
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
      wechatPublicUrl,
    } = this.state

    const renderQrCode = () => {
      return <img src={operateUrl} alt="班主任" className="qrcode" />
    }
    const classmatesCode = () => {
      return (
        <img src={wechatPublicUrl} alt="圈外同学服务号" className="qrcode" />
      )
    }

    return (
      <div className="pay-success">
        {/* <div className="gutter" style={{height: `${this.topPd}px`}} /> */}
        <div className="user-header">
          <img src={window.ENV.headImage} alt="" />
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
            <div
              className="step step-1"
              data-step="1"
              style={{paddingBottom: `${this.pd}px`}}
            >
              长按复制你的学号
              <br />
              <div className="code">{entryCode}</div>
            </div>
            <div
              className="step step-2"
              data-step="2"
              style={{paddingBottom: `${this.pd}px`}}
            >
              扫码添加班主任
              <div className="tip">
                您的班主任：{headTeacherNickName}，回复学号数字报道学习吧！
              </div>
              {renderQrCode()}
            </div>
            <div className="step step-3" data-step="3">
              扫码关注圈外同学服务号
              <div className="tip">
                这里是您学习的平台，我们也会为您推送学习相关内容。
              </div>
              {classmatesCode()}
            </div>
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
