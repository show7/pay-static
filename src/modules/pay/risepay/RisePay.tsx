import * as React from 'react'
import * as _ from 'lodash'
import './RisePay.less'
import { connect } from 'react-redux'
import { pget, mark } from 'utils/request'
import { getGoodsType, PayType, sa } from 'utils/helpers'
import { set, startLoad, endLoad, alertMsg } from 'redux/actions'
import { config, configShare } from 'modules/helpers/JsConfig'
import PayInfo from '../components/PayInfo'
import { getRiseMember } from '../async'
import { SaleBody } from './components/SaleBody'
import { MarkBlock } from '../components/markblock/MarkBlock'
import { addUserRecommendation } from './async'

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
      data: {}
    }
  }

  componentWillMount() {
    // ios／安卓微信支付兼容性
    if(!_.isEmpty(window.ENV.configUrl) &&
      window.ENV.configUrl !== window.location.href) {
      window.location.href = window.location.href
      return
    }
    const { dispatch } = this.props
    dispatch(startLoad())

    const id = this.props.location.query.riseId
    //表示是分享点击进入
    if(id) {
      mark({ module: '打点', function: '商学院guest', action: '购买商学院会员', memo: '通过分享途径' })
      addUserRecommendation(id)
    }

    // 查询订单信息
    getRiseMember(this.state.showId).then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
        this.setState({ data: res.msg })
        const { privilege } = res.msg
        if(privilege) {
          sa.track('openSalePayPage', {
            goodsType: getGoodsType(3),
            goodsId: '3'
          });
          mark(
            { module: '打点', function: '商学院会员', action: '购买商学院会员', memo: '入学页面' })
        } else {
          sa.track('openSaleApplyPage', {
            goodsType: getGoodsType(3),
            goodsId: '3'
          });
          mark(
            { module: '打点', function: '商学院会员', action: '购买商学院会员', memo: '申请页面' })
        }
      } else {
        dispatch(alertMsg(res.msg))
      }
    }).catch((err) => {
      dispatch(endLoad())
      dispatch(alertMsg(err))
    })
  }

  componentDidMount() {
    configShare(
      `圈外商学院--你负责努力，我们负责帮你赢`,
      `https://${window.location.hostname}/pay/static/rise`,
      'https://static.iqycamp.com/images/rise_share.jpg?imageslim',
      '最实用的竞争力提升课程，搭建最优质的人脉圈，解决最困扰的职场难题'
    )
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
        this.refs.payInfo.handleClickOpen();
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
    sa.track('clickApplyButton');
    this.context.router.push({
      pathname: '/pay/bsstart'
    })
  }

  handlePayedBefore() {
    mark({ module: '打点', function: '商学院会员', action: '点击付费' })
  }

  /**
   * 重新注册页面签名
   */
  reConfig() {
    config([ 'chooseWXPay' ])
  }

  handleClickAudition() {
    // 开试听课
    this.context.router.push({
      pathname: '/pay/preacher'
    })
  }

  render() {
    const { data, showId, timeOut, showErr, showCodeErr } = this.state
    const { privilege, buttonStr, auditionStr, memberType, tip } = data
    const { location } = this.props
    let payType = _.get(location, 'query.paytype')

    const renderPay = () => {
      if(!memberType) return null

      if(privilege) {
        return (
          <div className="button-footer">
            {
              auditionStr ? <div>
                <MarkBlock module={'打点'} func={'商学院会员'} action={'点击宣讲课按钮'} memo={data ? buttonStr : ''}
                           className="footer-left" onClick={() => this.handleClickAudition}>
                  <span style={{ fontSize: '18px' }}>{auditionStr}</span>
                </MarkBlock> <MarkBlock module={'打点'} func={'商学院会员'} action={'点击入学按钮'} className={'footer-btn'}
                                        onClick={() => this.handleClickOpenPayInfo(showId)}>
                <div className="audition">{buttonStr}</div>
              </MarkBlock>
              </div> : <MarkBlock module={'打点'} func={'商学院会员'} action={'点击入学按钮'} memo={data ? buttonStr : ''}
                                  className="footer-btn" onClick={() => this.handleClickOpenPayInfo(
                showId)}>
                {buttonStr}
              </MarkBlock>
            }

          </div>
        )
      } else {
        return (
          <div className="button-footer">
            {
              auditionStr ?
                <div>
                  {/*<MarkBlock module={`打点`} func={`商学院会员`} action={`点击宣讲课按钮`} memo={'申请页面'} className={`footer-left`}*/}
                  {/*onClick={() => this.handleClickAudition()}> <span*/}
                  {/*style={{ fontSize: '18px' }}>{auditionStr}</span> </MarkBlock>*/}
                  <MarkBlock module={'打点'} func={'商学院会员'}
                             action={'申请商学院'} memo={'申请页面'}
                             className={'footer-btn'}
                             onClick={() => this.redirect()}>
                    <div className="audition">申请商学院</div>
                  </MarkBlock>
                </div> :
                <MarkBlock module={`打点`} func={`商学院会员`} action={`申请商学院`} className={`footer-btn`}
                           onClick={() => this.redirect()}> 申请商学院 </MarkBlock>
            }

          </div>
        )
      }

    }

    return (
      <div className="rise-pay-container">
        <div className="pay-page">
          <SaleBody/> {renderPay()}
        </div>
        {
          timeOut &&
          <div className="mask" onClick={() => {window.history.back()}}
               style={{ background: 'url("https://static.iqycamp.com/images/riseMemberTimeOut.png?imageslim") center center/100% 100%' }}></div>
        } {
        showErr &&
        <div className="mask" onClick={() => this.setState({ showErr: false })}>
          <div className="tips">
            出现问题的童鞋看这里<br/> 1如果显示“URL未注册”，请重新刷新页面即可<br/> 2如果遇到“支付问题”，扫码联系小黑，并将出现问题的截图发给小黑<br/>
          </div>
          <img className="xiaoQ" src="https://static.iqycamp.com/images/asst_xiaohei.jpeg?imageslim"/>
        </div>
      } {
        showCodeErr &&
        <div className="mask" onClick={() => this.setState({ showCodeErr: false })}>
          <div className="tips">
            糟糕，支付不成功<br/> 原因：微信不支持跨公众号支付<br/> 怎么解决：<br/> 1，长按下方二维码，保存到相册；<br/> 2，打开微信扫一扫，点击右上角相册，选择二维码图片；<br/>
            3，在新开的页面完成支付即可<br/>
          </div>
          <img className="xiaoQ" style={{ width: '50%' }}
               src="https://static.iqycamp.com/images/pay_rise_code.png?imageslim"/>
        </div>
      } {
        memberType &&
        <PayInfo ref="payInfo" dispatch={this.props.dispatch} goodsType={getGoodsType(memberType.id)}
                 goodsId={memberType.id} header={memberType.name} priceTips={tip}
                 payedDone={(goodsId) => this.handlePayedDone()} payedCancel={(res) => this.handlePayedCancel(res)}
                 payedError={(res) => this.handlePayedError(res)} payedBefore={() => this.handlePayedBefore()}
                 payType={payType || PayType.WECHAT}/>
      }
      </div>
    )
  }
}
