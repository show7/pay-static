import * as React from 'react'
import * as _ from 'lodash'
import './PayL1.less'
import { connect } from 'react-redux'
import { mark } from 'utils/request'
import { PayType, sa, refreshForPay, saTrack } from 'utils/helpers'
import { set, startLoad, endLoad, alertMsg } from 'redux/actions'
import { config, configShare } from 'modules/helpers/JsConfig'
import PayInfo from '../components/PayInfo'
import { checkRiseMember, getRiseMember } from '../async'
import { SaleBody } from './components/SaleBody'
import { MarkBlock } from '../components/markblock/MarkBlock'
import { SubscribeAlert } from "./components/SubscribeAlert"

@connect(state => state)
export default class PayL1 extends React.Component<any, any> {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor() {
    super()
    this.state = {
      showId: 12,
      timeOut: false,
      showErr: false,
      showCodeErr: false,
      subscribe: false,
      data: {},
      riseId: null        //分享来源
    }
  }

  componentWillMount() {
    // ios／安卓微信支付兼容性
    if(refreshForPay()) {
      return;
    }
    const { dispatch } = this.props
    dispatch(startLoad())

    // 查询订单信息
    getRiseMember(this.state.showId).then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
        this.setState({ data: res.msg })
        const { quanwaiGoods = {} } = res.msg;
        const { privilege } = res.msg
        if(privilege) {
          saTrack('openSalePayPage', {
            goodsType: quanwaiGoods.goodsType + '',
            goodsId: quanwaiGoods.id + ''
          })
          mark({ module: '打点', function: quanwaiGoods.goodsType, action: quanwaiGoods.id, memo: '入学页面' })
        } else {
          saTrack('openSaleApplyPage', {
            goodsType: quanwaiGoods.goodsType + '',
            goodsId: quanwaiGoods.id + ''
          })
          mark({ module: '打点', function: quanwaiGoods.goodsType, action: quanwaiGoods.id, memo: '申请页面' })
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
    // TODO 设置分享
    // configShare(
    //   `圈外商学院--你负责努力，我们负责帮你赢`,
    //   `https://${window.location.hostname}/pay/rise`,
    //   'https://static.iqycamp.com/images/rise_share.jpg?imageslim',
    //   '最实用的竞争力提升课程，搭建最优质的人脉圈，解决最困扰的职场难题'
    // )
  }

  handlePayedDone() {
    const { data } = this.state
    const { quanwaiGoods = {} } = data
    mark({ module: '打点', function: '商学院会员', action: '支付成功', memo: quanwaiGoods.id })
    this.context.router.push({
      pathname: '/pay/member/success',
      query: {
        memberTypeId: quanwaiGoods.id
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
  handlePayedCancel() {
    this.setState({ showErr: true })
  }

  /**
   * 打开支付窗口
   * @param showId 会员类型id
   */
  handleClickOpenPayInfo(showId) {
    const { dispatch } = this.props;
    const { data } = this.state
    const { privilege, errorMsg } = data
    if(!privilege && !!errorMsg) {
      dispatch(alertMsg(errorMsg));
      return
    }

    this.reConfig()
    dispatch(startLoad())
    // 先检查是否能够支付
    checkRiseMember(showId).then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
        const { qrCode, privilege, errorMsg } = res.msg;
        if(privilege) {
          this.refs.payInfo.handleClickOpen();
        } else {
          dispatch(alertMsg(errorMsg))
        }
      }
      else {
        dispatch(alertMsg(res.msg))
      }
    }).catch(ex => {
      dispatch(endLoad())
      dispatch(alertMsg(ex))
    })
  }

  handlePayedBefore() {
    const { data } = this.state
    const { quanwaiGoods = {} } = data
    mark({ module: '打点', function: '商学院会员', action: '点击付费', memo: quanwaiGoods.id })
  }

  /**
   * 重新注册页面签名
   */
  reConfig() {
    config([ 'chooseWXPay' ])
  }

  render() {
    const { data, timeOut, showErr, showCodeErr, subscribe, showId } = this.state
    const { privilege, quanwaiGoods = {}, tip } = data
    const { location } = this.props
    let payType = _.get(location, 'query.paytype')

    const renderPay = () => {
      if(!quanwaiGoods.id) return null
      return (
        <div className="button-footer">
          <MarkBlock module={'打点'} func={quanwaiGoods.id} action={'点击入学按钮'} memo={privilege}
                     className="footer-btn" onClick={() => this.handleClickOpenPayInfo(quanwaiGoods.id)}>
            立即入学
          </MarkBlock>

        </div>
      )
    }

    return (
      <div className="rise-pay-container">
        <div className="pay-page">
          <SaleBody memberTypeId={showId}/>
          {renderPay()}
        </div>
        {
          timeOut &&
          <div className="mask" onClick={() => {window.history.back()}}
               style={{
                 background: 'url("https://static.iqycamp.com/images/riseMemberTimeOut.png?imageslim") center' +
                 ' center/100% 100%'
               }}/>
        }
        {
          showErr &&
          <div className="mask" onClick={() => this.setState({ showErr: false })}>
            <div className="tips">
              出现问题的童鞋看这里<br/> 1如果显示“URL未注册”，请重新刷新页面即可<br/> 2如果遇到“支付问题”，扫码联系招生办老师，并将出现问题的截图发给招生办老师<br/>
            </div>
            <img className="xiaoQ" src="https://static.iqycamp.com/images/code_zsbzr_0703.jpeg?imageslim"/>
          </div>
        }
        {
          showCodeErr &&
          <div className="mask" onClick={() => this.setState({ showCodeErr: false })}>
            <div className="tips">
              糟糕，支付不成功<br/> 原因：微信不支持跨公众号支付<br/> 怎么解决：<br/> 1，长按下方二维码，保存到相册；<br/> 2，打开微信扫一扫，点击右上角相册，选择二维码图片；<br/>
              3，在新开的页面完成支付即可<br/>
            </div>
            <img className="xiaoQ" style={{ width: '50%' }}
                 src="https://static.iqycamp.com/images/code_zsbzr_0703.jpeg?imageslim"/>
          </div>
        }
        {
          quanwaiGoods &&
          <PayInfo ref="payInfo" dispatch={this.props.dispatch} goodsType={quanwaiGoods.goodsType}
                   goodsId={quanwaiGoods.id} header={quanwaiGoods.name} priceTips={tip}
                   payedDone={(goodsId) => this.handlePayedDone(goodsId)}
                   payedCancel={(res) => this.handlePayedCancel(res)}
                   payedError={(res) => this.handlePayedError(res)} payedBefore={() => this.handlePayedBefore()}
                   payType={payType || PayType.WECHAT}/>
        }
        {
          subscribe && <SubscribeAlert closeFunc={() => this.setState({ subscribe: false })}/>
        }

      </div>
    )
  }
}
