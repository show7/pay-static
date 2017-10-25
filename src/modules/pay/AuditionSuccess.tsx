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
        this.setState({
          startTime: res.msg.startTime,
          endTime: res.msg.endTime,
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
    const { memberTypeId, startTime, endTime, entryCode } = this.state

    return (
      <div className="audition-success">
        <div className={`pay-result`}>
          <div className={`content`} style={{ width: this.cardWidth, height: this.cardHeight }}>
          </div>
        </div>
        <div className="welcome-tips">
          <div className="nickname">
            Hi {window.ENV.userName}
          </div>
          <div className="welcome">
            你已成功报名商学院试听课
          </div>
          <div className="tips">
            现在点击下方按钮，领取圈外客服的微信二维码。让ta拉你进学习群吧！
          </div>
        </div>
        <img src="https://static.iqycamp.com/images/pay_camp_code.png?imageslim" alt="小黑" className="qrcode"/>
        <div className="close-button" onClick={() => closeWindow()}>我要进群</div>
      </div>
    )
  }
}
