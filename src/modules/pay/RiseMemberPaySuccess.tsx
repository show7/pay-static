import * as React from 'react'
import * as _ from 'lodash'
import './RiseMemberPaySuccess.less'
import { connect } from 'react-redux'
import { ppost, pget } from 'utils/request'
import { set, startLoad, endLoad, alertMsg } from 'redux/actions'
import { Button, ButtonArea } from 'react-weui'
import { changeTitle } from 'utils/helpers'
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
    this.cardHeight = this.cardWidth * (208 / 375)
    this.bigFontSize = 40 / 750 * window.innerWidth
    this.smallFontSize = 30 / 750 * window.innerWidth
    this.pd = 130 / 750 * window.innerWidth
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(startLoad())
    // 查询订单信息
    pget('/customer/rise/member').then(res => {
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

    pget('/customer/profile').then(res => {
      if(res.code === 200) {
        const { isFull, bindMobile } = res.msg
        this.setState({ isFull: isFull, bindMobile: bindMobile })
      } else {
        dispatch(alertMsg(res.msg))
      }
    }).catch(ex => {
      dispatch(alertMsg(ex))
    })
  }

  close(){
    closeWindow()
  }

  render() {
    const { memberTypeId, startTime, endTime } = this.state
    const renderWelComeTips = () => {
      switch(memberTypeId) {
        case 5:
          return (
            <div className="welcome-tips">
              <span className={`big member${memberTypeId}`} style={{ fontSize: `${this.bigFontSize}px` }}>
                Hi {window.ENV.userName}，欢迎加入小课训练营</span>
              <span className="small" style={{ fontSize: `${this.smallFontSize}px`, padding: `50px ${this.pd}px` }}>
                现在点击下方按钮，领取圈外客服的微信二维码。让TA拉你进学习群！
              </span>
            </div>
          )
        default:
          return (
            <div className="welcome-tips">
              <span className={`big member${memberTypeId}`} style={{ fontSize: `${this.bigFontSize}px` }}>
                Hi {window.ENV.userName}，欢迎加入商学院</span>
              <span className="small" style={{ fontSize: `${this.smallFontSize}px`, padding: `50px ${this.pd}px` }}>
                现在点击下方按钮，领取圈外客服的微信二维码。让TA拉你进学习群！
              </span>
            </div>
          )
      }
    }

    return (
      <div className="rise-pay-success" style={{ minHeight: window.innerHeight }}>
        <div className={`pay-result member${memberTypeId}`}>
          <div className={`content member${memberTypeId}`} style={{ width: this.cardWidth, height: this.cardHeight }}>
            <div className="times">
              {startTime}-{endTime}
            </div>
          </div>
        </div>
        {renderWelComeTips()}
        <div className="close-button" onClick={() => closeWindow()}>领取圈外客服二维码</div>
      </div>
    )
  }
}
