import * as React from 'react'
import * as _ from 'lodash'
import { ppost, pget, mark } from 'utils/request'
import { set, startLoad, endLoad, alertMsg } from 'redux/actions'
import { connect } from 'react-redux'
import { config } from 'modules/helpers/JsConfig'
import './ApplySuccess.less'
import { getGoodsType } from 'utils/helpers'
import PayInfo from '../components/PayInfo'
import { mark } from '../../../utils/request'
import { SaleBody } from './components/SaleBody'
import { CustomerService } from '../../../components/customerservice/CustomerService'
import { getRiseMember } from '../async'
import Icon from '../../../components/Icon'
import { MarkBlock } from '../components/markblock/MarkBlock'

@connect(state => state)
export default class ApplySuccess extends React.Component<any, any> {

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
      data: {},
      more: false
    }
  }

  componentWillMount() {
    mark({ module: '打点', function: '商学院会员', action: '购买商学院会员', memo: '申请成功页面' })

    // ios／安卓微信支付兼容性
    if(window.ENV.configUrl != '' && window.ENV.configUrl !== window.location.href) {
      window.location.href = window.location.href
      return
    }

    const { dispatch } = this.props
    dispatch(startLoad())

    // 查询订单信息
    getRiseMember(this.state.showId).then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
        this.countDown(res.msg.remainHour, res.msg.remainMinute)
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
    mark({ module: '打点', function: '商学院会员', action: '支付成功' })
    this.context.router.push({
      pathname: '/pay/member/success',
      query: {
        memberTypeId: 3
      }
    })
  }

  handleClickIntro() {
    this.setState({ more: true })
  }

  countDown(remainHour, remainMinute) {
    if(remainHour === 0 && remainMinute === 0) {
      this.setState({ expired: true })
    } else {
      if(remainHour !== 0) {
        if(remainHour > 99) {
          remainHour = 99
        }
        let hourStr = remainHour + ''
        let ones = '0'
        let tens = '0'
        // 小于等于0 按0算
        if(hourStr.length > 1) {
          ones = hourStr[1]
          tens = hourStr[0]
        } else {
          // 1位数
          ones = hourStr[0]
        }
        this.setState({ ones: ones, tens: tens, unit: '小时', expired: false })
      } else {
        let minuteStr = remainMinute + ''
        let ones = '0'
        let tens = '0'
        // 小于等于0 按0算
        if(minuteStr.length > 1) {
          ones = minuteStr[1]
          tens = minuteStr[0]
        } else {
          // 1位数
          ones = minuteStr[0]
        }
        this.setState({ ones: ones, tens: tens, unit: '分钟', expired: false })
      }
    }
  }

  /** 处理支付失败的状态 */
  handlePayedError(res) {
    let param = _.get(res, 'err_desc', _.get(res, 'errMsg', ''))
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

  handlePayedBefore() {
    mark({ module: '打点', function: '商学院会员', action: '点击付费' })
  }

  /**
   * 重新注册页面签名
   */
  reConfig() {
    config(['chooseWXPay'])
  }

  redirect() {
    window.location.href = `https://${window.location.hostname}/rise/static/business/apply/start`
  }

  handleClickAudition() {
    // 开试听课
    this.context.router.push({
      pathname: '/pay/preacher'
    })
  }

  render() {
    const { data, showId, timeOut, showErr, showCodeErr, more, tens, ones, unit, expired } = this.state
    const { memberType, buttonStr, tip } = data

    const renderPay = () => {
      return (
        <div className="button-footer">
          <MarkBlock module={'打点'} func={'申请成功页面'} action={'点击入学按钮'}
                     className="footer-left" onClick={() => this.handleClickAudition()}>
            <span className="audition">宣讲课</span>
          </MarkBlock>
          <MarkBlock module={'打点'} func={'商学院会员'} action={'点击入学按钮'}
                     memo={this.state.data ? this.state.data.buttonStr : ''}
                     className="footer-btn" onClick={() => this.handleClickOpenPayInfo(showId)}>
            {buttonStr}
          </MarkBlock>
        </div>
      )
    }

    const renderApply = () => {
      return (
        <div className="button-footer">
          <MarkBlock module={'打点'} func={'申请成功页面'} action={'点击入学按钮'}
                     className="footer-left" onClick={() => this.handleClickAudition()}>
            <span className="audition">宣讲课</span>
          </MarkBlock>
          <MarkBlock module={'打点'} func={'商学院会员'} action={'申请商学院'}
                     className="footer-btn" onClick={() => this.redirect()}>
            申请商学院
          </MarkBlock>
        </div>
      )
    }

    const renderKefu = () => {
      return (
        <CustomerService image="https://static.iqycamp.com/images/kefu_ruxuezixun.png?imageslim"/>
      )
    }

    const renderCountdown = () => {
      return (
        <div>
          <div className="apply-header">
            {'恭喜你通过商学院申请!'}
          </div>
          <div className="header">
            <div className="msg">离入学截止时间还剩</div>
          </div>
          <div className="remainder">
            <div className="time">
              <div className={`tens-place place ${unit == '小时' ? 'hour' : 'minute'}`}>
                {tens}
              </div>
              <div className={`ones-place place ${unit == '小时' ? 'hour' : 'minute'}`}>
                {ones}
              </div>
            </div>
          </div>
          <div className="click-tips">
            请点击下方按钮，及时办理入学<br/>
            过期后需再次申请
          </div>
          <div className="welcome-msg">
            {memberType ? `友情提示：商学院学费即将升至¥${memberType.fee + 400}` : null}
            <br/>
            {memberType ? `请尽快办理入学` : null}
          </div>
          {
            more ?
              <div className="desc-container">
                <SaleBody loading={false}/>
              </div> :
              <MarkBlock module={'打点'} func={'商学院会员'} action={'打开商学院介绍'}
                         onClick={() => this.handleClickIntro()}>
                商学院介绍
              </MarkBlock>
          }

          {renderPay()}
          {renderKefu()}
          {
            timeOut &&
            <div className="mask" onClick={() => {window.history.back()}}
                 style={{ background: 'url("https://static.iqycamp.com/images/riseMemberTimeOut.png?imageslim") center center/100% 100%' }}>
            </div>
          }
          {
            showErr &&
            <div className="mask" onClick={() => this.setState({ showErr: false })}>
              <div className="tips">
                出现问题的童鞋看这里<br/>
                1如果显示“URL未注册”，请重新刷新页面即可<br/>
                2如果遇到“支付问题”，扫码联系小黑，并将出现问题的截图发给小黑<br/>
              </div>
              <img className="xiaoQ" src="https://static.iqycamp.com/images/asst_xiaohei.jpeg?imageslim"/>
            </div>
          }
          {
            showCodeErr &&
            <div className="mask" onClick={() => this.setState({ showCodeErr: false })}>
              <div className="tips">
                糟糕，支付不成功<br/>
                原因：微信不支持跨公众号支付<br/>
                怎么解决：<br/>
                1，长按下方二维码，保存到相册；<br/>
                2，打开微信扫一扫，点击右上角相册，选择二维码图片；<br/>
                3，在新开的页面完成支付即可<br/>
              </div>
              <img className="xiaoQ" style={{ width: '50%' }}
                   src="https://static.iqycamp.com/images/applySuccessCode.png?imageslim"/>
            </div>
          }
          {
            memberType &&
            <PayInfo ref="payInfo"
                     dispatch={this.props.dispatch}
                     goodsType={getGoodsType(memberType.id)}
                     goodsId={memberType.id}
                     header={memberType.name}
                     priceTips={tip}
                     payedDone={(goodsId) => this.handlePayedDone()}
                     payedCancel={(res) => this.handlePayedCancel(res)}
                     payedError={(res) => this.handlePayedError(res)}
                     payedBefore={() => this.handlePayedBefore()}/>
          }
        </div>
      )
    }

    const renderExpired = () => {
      return (
        <div>
          <div className="apply-header">
            {'很抱歉，您的入学资格已过期!'}
          </div>
          <div className="apply-icon">
            <Icon type='apply_fail'/>
          </div>
          <div className="click-tips">
            由于您未在申请通过后48小时内办理入学<br/>
            入学资格已过期。
          </div>
          {renderApply()}
          {renderKefu()}
          {timeOut ? <div className="mask" onClick={() => {window.history.back()}}
                          style={{ background: 'url("https://static.iqycamp.com/images/riseMemberTimeOut.png?imageslim") center center/100% 100%' }}>
          </div> : null}
        </div>
      )
    }

    return (
      <div className="rise-pay-apply-container">
        {expired ? renderExpired() : renderCountdown()}

      </div>
    )
  }
}
