import * as React from 'react'
import './CampPaySuccess.less'
import { connect } from 'react-redux'
import { set, startLoad, endLoad, alertMsg } from 'redux/actions'
import { entryRiseMember } from './async'

@connect(state => state)
export default class RiseMemberPaySuccess extends React.Component<any, any> {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor() {
    super()
    this.state = {}
    this.cardWidth = 540 / 750 * window.innerWidth
    this.cardHeight = this.cardWidth * (300 / 540)
    this.bigFontSize = 40 / 750 * window.innerWidth
    this.smallFontSize = 30 / 750 * window.innerWidth
    this.pd = 130 / 750 * window.innerWidth
  }

  componentWillMount() {
    const { dispatch } = this.props
    const { memberTypeId } = this.props.location.query
    dispatch(startLoad())
    // 查询订单信息
    entryRiseMember(memberTypeId).then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
        this.setState({
          startTime: res.msg.startTime,
          endTime: res.msg.endTime,
          memberTypeId: memberTypeId,
          entryCode: res.msg.entryCode
        })
      } else {
        dispatch(alertMsg(res.msg))
      }
    }).catch(ex => {
      dispatch(endLoad())
      dispatch(alertMsg(ex))
    })
  }

  goLearnPage() {
    window.location.href = `/rise/static/camp`
  }

  render() {
    const { memberTypeId, startTime, endTime, entryCode } = this.state
    const renderWelComeTips = () => {
      switch(parseInt(memberTypeId)) {
        case 5:
          return (
            <div className="welcome-tips">
              <div className="nickname">
                Hi {window.ENV.userName}
              </div>
              <div className="welcome">
                欢迎加入专项课
              </div>
              <div className="tips">
                扫码加小哥哥微信，回复学号<br/>
                <span style={{ color: 'orange' }}>{entryCode}</span><br/>
                让他拉你进班级群吧
              </div>
            </div>
          )
        default:
          return (
            <div className="welcome-tips">
              <div className="nickname">
                Hi {window.ENV.userName}
              </div>
              <div className="welcome">
                欢迎加入商学院
              </div>
              <div className="tips">
                扫码加小哥哥微信，回复学号<br/>
                <span style={{ color: 'orange' }}>{entryCode}</span><br/>
                让他拉你进班级群吧
              </div>
            </div>
          )
      }
    }

    return (
      <div className="rise-pay-success">
        <div className={`pay-result member${memberTypeId}`}>
          <div className={`content member${memberTypeId}`} style={{ width: this.cardWidth, height: this.cardHeight }}>
            <div className="times">
              {startTime}-{endTime}
            </div>
          </div>
        </div>
        {renderWelComeTips()}
        <img src="https://static.iqycamp.com/images/xiaohei_code_1109.jpeg?imageslim" alt="小黑" className="qrcode"/>
      </div>
    )
  }
}
