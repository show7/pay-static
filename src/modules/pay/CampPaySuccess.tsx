import * as React from 'react'
import './CampPaySuccess.less'
import { connect } from 'react-redux'
import { ppost, pget } from 'utils/request'
import { set, startLoad, endLoad, alertMsg } from 'redux/actions'
import { Button, ButtonArea } from 'react-weui'
import { closeWindow } from '../helpers/JsConfig'

const P = 'signup'
const numeral = require('numeral')

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
    pget(`/signup/rise/member/${memberTypeId}`).then(res => {
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
    window.location.href = `https://${window.location.hostname}/rise/static/plan/main`
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
                欢迎加入训练营
              </div>
              <div className="tips">
                扫码加小哥哥微信，回复入群密令<br/>
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
                扫码加小哥哥微信，回复入群密令<br/>
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
        <div className="close-button" onClick={() => this.goLearnPage()}>已入群，开始学习</div>
      </div>
    )
  }
}
