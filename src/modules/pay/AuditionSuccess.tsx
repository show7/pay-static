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
        <div className="header-msg">商学院试听课预约</div>
        <div className="header-tips">（本期试听课于本周日20:30开始）</div>
        <div className={`pay-result`}>
          <div className="content">
            <img src="https://static.iqycamp.com/images/audition_success_icon.png?imageslim"/>
          </div>
        </div>
        <div className="welcome-tips">
          <div className="welcome">
          </div>
          <div className="tips">
            预约请扫码加小助手,通过后回复数字：
            <span style={{ color: 'orange', fontSize: '28px',display:"block",padding:"20px 0 0" }}>{className}</span>
          </div>
          <img src="https://static.iqycamp.com/images/qrcode_xiaoy_20171117.jpeg?imageslim" alt="小黑"
               className="qrcode"/>
        </div>
        {/*<div className="close-button" onClick={() => closeWindow()}>预约试听</div>*/}
      </div>
    )
  }
}
