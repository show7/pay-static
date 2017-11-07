import * as React from 'react'
import './MemberPaySuccess.less'
import { connect } from 'react-redux'
import { ppost, pget } from 'utils/request'
import { set, startLoad, endLoad, alertMsg } from 'redux/actions'
import { Button, ButtonArea } from 'react-weui'
import { closeWindow } from '../helpers/JsConfig'

const P = 'signup'
const numeral = require('numeral')

@connect(state => state)
export default class MemberPaySuccess extends React.Component<any, any> {

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

  render() {
    const { entryCode } = this.state

    return (
      <div className="pay-success">
        <div className="success-header">报名成功</div>
        <div className="success-tips">
          Hi, {window.ENV.userName}，欢迎加入商学院
        </div>
        <div className="step-wrapper">
          <div className="content">
            <div className="step step-1" data-step="1">
              你的学号：<span className="code">{entryCode}</span><br/>
              （长按复制）
            </div>
            <div className="step step-2" data-step="2">
              扫码添加班主任<br/>
              <img src="https://static.iqycamp.com/images/fragment/xiaoy_qrcode.jpeg?imageslim" alt="小黑"
                   className="qrcode"/>
            </div>
            <div className="step step-3" data-step="3">
              通过后<br/>
              回复学号数字报道吧！
            </div>
          </div>
        </div>
      </div>
    )
  }
}
