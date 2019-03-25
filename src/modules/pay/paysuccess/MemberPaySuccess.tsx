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
    this.state = {}

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
          this.setState({
            entryCode: res.msg.entryCode,
            goodsName: res.msg.goodsName,
            operateUrl: res.msg.operateUrl,
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
    const {entryCode, goodsName, operateUrl} = this.state

    const renderQrCode = () => {
      return <img src={operateUrl} alt="班主任" className="qrcode" />
    }

    return (
      <div className="pay-success">
        <div className="gutter" style={{height: `${this.topPd}px`}} />
        <div className="success-header">报名成功</div>
        <div className="success-tips">
          Hi, {window.ENV.userName}，欢迎加入{goodsName}
        </div>
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
              <div className="tip">工作日两小时內回复，请耐心等待</div>
              {renderQrCode()}
            </div>
            <div className="step step-3" data-step="3">
              通过后
              <br />
              回复学号数字报道吧！
            </div>
          </div>
        </div>
      </div>
    )
  }
}
