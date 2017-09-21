import * as React from 'react'
import * as _ from 'lodash'
import './RisePay.less'
import { connect } from 'react-redux'
import { ppost, pget } from 'utils/request'
import { getGoodName } from 'utils/helpers'
import { set, startLoad, endLoad, alertMsg } from 'redux/actions'
import { Button, ButtonArea } from 'react-weui'
import { config } from 'modules/helpers/JsConfig'
import PayInfo from './components/PayInfo'
import PicLoading from './components/PicLoading'

const numeral = require('numeral')

@connect(state => state)
export default class RisePay extends React.Component<any, any> {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor() {
    super()
    this.state = {
      showId: 3,
      timeOut: false,
      showErr: false,
      showCodeErr: false,
      loading: true,
      data: {}
    }
  }

  componentWillMount() {
    // ios／安卓微信支付兼容性
    if(window.ENV.configUrl != '' && window.ENV.configUrl !== window.location.href) {
      ppost('/b/mark', {
        module: 'RISE',
        function: '打点',
        action: '刷新支付页面',
        memo: window.ENV.configUrl + '++++++++++' + window.location.href
      })
      window.location.href = window.location.href
      return
    }

    const { dispatch } = this.props
    dispatch(startLoad())

    // 查询订单信息
    pget(`/signup/rise/member`).then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
        this.setState({ data: res.msg })
      } else {
        dispatch(alertMsg(res.msg))
      }
    }).catch((err) => {
      dispatch(endLoad())
      dispatch(alertMsg(err))
    })
  }

  handlePayedDone() {
    this.context.router.push({
      pathname: '/pay/risemember/success',
      query: {
        memberTypeId: 3
      }
    })
  }

  /** 处理支付失败的状态 */
  handlePayedError(res) {
    let param = _.get(res, 'err_desc')
    if(param.indexOf('跨公众号发起') != -1) {
      // 跨公众号
      this.setState({ showCodeErr: true })
    } else {
      this.setState({ showErr: true })
    }
  }

  /** 处理取消支付的状态 */
  handlePayedCancel(res) {
    this.setState({ showErr: true })
  }

  /**
   * 打开支付窗口
   * @param showId 会员类型id
   */
  handleClickOpenPayInfo(showId) {
    this.reConfig()
    const { memberTypes } = this.state
    const item = _.find(memberTypes, { id: showId })
    const { dispatch } = this.props
    dispatch(startLoad())
    // 先检查是否能够支付
    pget(`/signup/rise/member/check/${showId}`).then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
        // 查询是否还在报名
        this.refs.payInfo.handleClickOpen()
      } else if(res.code === 214) {
        this.setState({ timeOut: true })
      } else {
        dispatch(alertMsg(res.msg))
      }
    }).catch(ex => {
      dispatch(endLoad())
      dispatch(alertMsg(ex))
    })
  }

  redirect() {
    window.location.href = 'https://www.iquanwai.com/survey/wjx?activity=16666777'
  }

  /**
   * 重新注册页面签名
   */
  reConfig() {
    config(['chooseWXPay'])
  }

  render() {
    const { data, showId, timeOut, showErr, showCodeErr, loading } = this.state
    const { memberTypes, privilege } = data

    const showMember = _.find(memberTypes, { id: showId })

    const renderPay = () => {
      return (
        <div className="pay-page">
          <div className="sale-pic">
            <img src="https://static.iqycamp.com/images/rise_promotion_4.png?imageslim"
                 style={{ width: '100%' }}
                 onLoad={() => this.setState({ loading: false })}/>
          </div>
          {
            privilege ?
              <div className="button-footer" onClick={() => this.handleClickOpenPayInfo(showId)}>
                <div className="footer-btn">立即入学</div>
              </div> :
              <div className="button-footer" onClick={() => this.redirect()}>
                <div className="footer-btn">申请商学院</div>
              </div>
          }

        </div>
      )
    }

    return (
      <div className="rise-pay-container">
        <PicLoading show={loading}/>
        {renderPay()}
        { timeOut ? <div className="mask" onClick={() => {window.history.back()}}
                         style={{ background: 'url("https://static.iqycamp.com/images/riseMemberTimeOut.png?imageslim") center center/100% 100%' }}>
        </div> : null}
        { showErr ? <div className="mask" onClick={() => this.setState({ showErr: false })}>
          <div className="tips">
            出现问题的童鞋看这里<br/>
            1如果显示“URL未注册”，请重新刷新页面即可<br/>
            2如果遇到“支付问题”，扫码联系小黑，并将出现问题的截图发给小黑<br/>
          </div>
          <img className="xiaoQ" src="https://static.iqycamp.com/images/asst_xiaohei.jpeg?imageslim"/>
        </div> : null}
        { showCodeErr ? <div className="mask" onClick={() => this.setState({ showCodeErr: false })}>
          <div className="tips">
            糟糕，支付不成功<br/>
            原因：微信不支持跨公众号支付<br/>
            怎么解决：<br/>
            1，长按下方二维码，保存到相册；<br/>
            2，打开微信扫一扫，点击右上角相册，选择二维码图片；<br/>
            3，在新开的页面完成支付即可<br/>
          </div>
          <img className="xiaoQ" style={{ width: '50%' }}
               src="https://static.iqycamp.com/images/pay_rise_code.png?imageslim"/>
        </div> : null}
        { showMember ? <PayInfo ref="payInfo"
                                dispatch={this.props.dispatch}
                                goodsType={getGoodName(showMember.id)}
                                goodsId={showMember.id}
                                header={showMember.name}
                                payedDone={(goodsId) => this.handlePayedDone(goodsId)}
                                payedCancel={(res) => this.handlePayedCancel(res)}
                                payedError={(res) => this.handlePayedError(res)}
        /> : null}
      </div>
    )
  }
}
