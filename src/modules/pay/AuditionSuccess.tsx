import * as React from 'react'
import './AuditionSuccess.less'
import { connect } from 'react-redux'
import { set, startLoad, endLoad, alertMsg } from 'redux/actions'
import { Button, ButtonArea } from 'react-weui'
import { closeWindow } from '../helpers/JsConfig'
import { chooseAuditionCourse } from './async';

@connect(state => state)
export default class AuditionSuccess extends React.Component<any, any> {

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
    dispatch(startLoad())
    // 查询订单信息
    chooseAuditionCourse().then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
        this.setState(res.msg)
      } else {
        dispatch(alertMsg(res.msg))
      }
    }).catch(ex => {
      dispatch(endLoad())
      dispatch(alertMsg(ex))
    })
  }

  render() {
    const { memberTypeId, startTime, endTime, className } = this.state

    return (
      <div className="audition-success">
        <div className={`pay-result`}>
          <div className={`content`} style={{ width: this.cardWidth, height: this.cardHeight }}>
          </div>
        </div>
        <div className="welcome-tips">
          {/*<div className="nickname">*/}
          {/*Hi {window.ENV.userName}*/}
          {/*</div>*/}
          <div className="welcome">
          </div>
          <div className="tips">
            预约请扫码加小助手，通过后，回复你的预约号：<span style={{ color: 'orange' }}>{className}</span><br/>
            本周日晚上8点统一开课，到时会通知你哦
          </div>
        </div>
        <img src="https://static.iqycamp.com/images/fragment/xiaoy_qrcode.jpeg?imageslim" alt="小黑" className="qrcode"/>
        {/*<div className="close-button" onClick={() => closeWindow()}>预约试听</div>*/}
      </div>
    )
  }
}
