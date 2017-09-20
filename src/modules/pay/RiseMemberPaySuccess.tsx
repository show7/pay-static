import * as React from 'react'
import * as _ from 'lodash'
import './RiseMemberPaySuccess.less'
import { connect } from 'react-redux'
import { ppost, pget } from 'utils/request'
import { set, startLoad, endLoad, alertMsg } from 'redux/actions'
import { Button, ButtonArea } from 'react-weui'
import { changeTitle } from 'utils/helpers'

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
    changeTitle('了解更多')
    const { dispatch, location } = this.props
    const productId = _.get(location, 'query.productId')
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
        console.log(res.msg)
        const { isFull, bindMobile } = res.msg
        this.setState({ isFull: isFull, bindMobile: bindMobile })
      } else {
        dispatch(alertMsg(ex))
      }
    }).catch(ex => {
      dispatch(alertMsg(ex))
    })
  }

  go() {
    // 查看是否填写完毕信息，如果没有填写的话则跳到填写页面
    const { isFull, bindMobile } = this.state
    if(!isFull) {
      window.location.href = `https://${window.location.hostname}/rise/static/customer/profile?goRise=true`
      return
    }
    if(!bindMobile) {
      window.location.href = `https://${window.location.hostname}/rise/static/customer/mobile/check?goRise=true`
      return
    }
    window.location.href = `https://${window.location.hostname}/rise/static/problem/explore`
  }

  render() {
    const { memberTypeId, startTime, endTime } = this.state
    console.log('this.state', this.state)
    const renderWelComeTips = () => {
      switch(memberTypeId) {
        case 5:
          return (
            <div className="welcome-tips">
              <span className={`big member${memberTypeId}`} style={{ fontSize: `${this.bigFontSize}px` }}>
              Hi {window.ENV.userName}，欢迎加入小课训练营</span>
              <span className="small" style={{ fontSize: `${this.smallFontSize}px`, padding: `50px ${this.pd}px` }}>
                体验训练营带学模式，快去加群。<br/>
                请去“圈外同学” - “我的” - “个人中心” 查看加群消息吧~
              </span><br/>
            </div>
          )
        default:
          return (
            <div className="welcome-tips">
              <span className={`big member${memberTypeId}`} style={{ fontSize: `${this.bigFontSize}px` }}>
              Hi {window.ENV.userName}，欢迎加入精英会员</span>
              <span className="small" style={{ fontSize: `${this.smallFontSize}px`, padding: `50px ${this.pd}px` }}>
              现在开始加群，进行主题学习，快去个人中心查看加群消息吧！
              </span>
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
        <div className="button-footer" onClick={() => this.go()}>确定</div>
      </div>
    )
  }
}
