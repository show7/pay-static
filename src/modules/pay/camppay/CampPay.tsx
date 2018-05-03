import * as React from 'react'
import * as _ from 'lodash'
import './CampPay.less'
import { connect } from 'react-redux'
import { mark } from '../../../utils/request'
import { getGoodsType } from '../../../utils/helpers'
import { set, startLoad, endLoad, alertMsg } from '../../../redux/actions'
import { config } from '../../helpers/JsConfig'
import PayInfo from '../components/PayInfo'
import PicLoading from '../components/PicLoading'
import { getRiseMember, checkRiseMember } from '../async'
import { signupCamp, getCampPageInfo } from './async'
import { CustomerService } from '../../../components/customerservice/CustomerService'
import { MarkBlock } from '../components/markblock/MarkBlock'
import { SubmitButton } from '../../../components/submitbutton/SubmitButton'

@connect(state => state)
export default class CampPay extends React.Component<any, any> {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor() {
    super()
    this.state = {
      showId: 5,
      timeOut: false,
      showErr: false,
      showCodeErr: false,
      loading: true,
      data: {},
      currentCampMonth: 0,
      campPaymentImage: '',
    }
  }

  async componentWillMount() {
    // ios／安卓微信支付兼容性
    if(!_.isEmpty(window.ENV.configUrl) && window.ENV.configUrl !== window.location.href) {
      window.location.href = window.location.href
      return
    }

    const { dispatch } = this.props
    dispatch(startLoad())

    // 查询订单信息
    let res = await getRiseMember(this.state.showId)
    dispatch(endLoad())
    if(res.code === 200) {
      this.setState({ data: res.msg })
    } else {
      dispatch(alertMsg(res.msg))
    }
    res = await signupCamp()
    this.setState({ currentCampMonth: _.get(res, 'msg.markSellingMemo', 'error') }, () => {
      mark({ module: '打点', function: '小课训练营', action: '购买小课训练营', memo: _.get(res, 'msg.markSellingMemo', 'error') })
    })
    res = await getCampPageInfo()
    if(res.code === 200) {
      this.setState({ campPaymentImage: res.msg.campPaymentImage })
    } else {
      dispatch(alertMsg(res.msg))
    }
  }

  handlePayedDone() {
    mark({ module: '打点', function: '小课训练营', action: '支付成功', memo: this.state.currentCampMonth })
    this.context.router.push({
      pathname: '/pay/camp/success',
      query: {
        memberTypeId: 5
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
  async handleClickOpenPayInfo(showId) {
    this.reConfig()
    const { dispatch } = this.props
    dispatch(startLoad())
    // 先检查是否能够支付
    let res = await checkRiseMember(showId)
    dispatch(endLoad())
    if(res.code === 200) {
      const { qrCode, privilege, errorMsg } = res.msg;
      if(privilege) {
        this.refs.payInfo.handleClickOpen()
      } else {
        dispatch(alertMsg(errorMsg))
      }
    }
    else {
      dispatch(alertMsg(res.msg))
    }
  }

  handlePayedBefore() {
    mark({ module: '打点', function: '小课训练营', action: '点击付费', memo: this.state.currentCampMonth })
  }

  /**
   * 重新注册页面签名
   */
  reConfig() {
    config([ 'chooseWXPay' ])
  }

  render() {
    const { data, showId, timeOut, showErr, showCodeErr, loading, campPaymentImage } = this.state
    const { memberType } = data

    const renderPay = () => {
      return (
        <div className="pay-page">
          <img className="sale-pic" style={{ width: '100%' }} src={campPaymentImage}
               onLoad={() => this.setState({ loading: false })}/> <MarkBlock module={'打点'} func={'小课训练营'}
                                                                             action={'点击加入按钮'}
                                                                             memo={this.state.currentCampMonth}>
          <SubmitButton clickFunc={() => this.handleClickOpenPayInfo(showId)} buttonText={'我要报名！'}/> </MarkBlock>
        </div>
      )
    }

    const renderKefu = () => {
      return (
        <CustomerService componentStyle="customer-camp-component"/>
      )
    }

    return (
      <div className="camp-pay-container" style={{ background: '#d85a47' }}>
        <PicLoading show={loading}/>
        {renderPay()}
        {renderKefu()}
          {timeOut &&
          <div className="mask" onClick={() => {window.history.back()}}
               style={{ background: 'url("https://static.iqycamp.com/images/riseMemberTimeOut.png?imageslim") center center/100% 100%' }}></div>} {showErr &&
          <div className="mask" onClick={() => this.setState({ showErr: false })}>
            <div className="tips">
              出现问题的童鞋看这里<br/> 1如果显示“URL未注册”，请重新刷新页面即可<br/> 2如果遇到“支付问题”，扫码联系小黑，并将出现问题的截图发给小黑<br/>
            </div>
            <img className="xiaoQ" src="https://static.iqycamp.com/images/asst_xiaohei.jpeg?imageslim"/>
          </div>
        }
        {showCodeErr && <div className="mask" onClick={() => this.setState({ showCodeErr: false })}>
          <div className="tips">
            糟糕，支付不成功<br/> 原因：微信不支持跨公众号支付<br/> 怎么解决：<br/> 1，长按下方二维码，保存到相册；<br/> 2，打开微信扫一扫，点击右上角相册，选择二维码图片；<br/>
            3，在新开的页面完成支付即可<br/>
          </div>
          <img className="xiaoQ" style={{ width: '50%' }}
             src="https://static.iqycamp.com/images/pay_camp_code.png?imageslim"/>
          </div>
        }
        {memberType &&
          <PayInfo ref="payInfo" dispatch={this.props.dispatch} goodsType={getGoodsType(memberType.id)}
               goodsId={memberType.id} payedDone={(goodsId) => this.handlePayedDone()}
               payedCancel={(res) => this.handlePayedCancel(res)} payedError={(res) => this.handlePayedError(res)}
               payedBefore={() => this.handlePayedBefore()}/>
        }
      </div>
    )
  }
}
