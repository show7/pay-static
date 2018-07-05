import React, { Component } from 'react';
import { connect } from 'react-redux';
import './BusinessApplyChoice.less';
import { set, startLoad, endLoad, alertMsg } from "redux/actions"
import * as _ from 'lodash';
import { mark } from "utils/request"
import { getRiseMember, checkRiseMember } from '../async'
import { config } from '../../helpers/JsConfig'
import { refreshForPay, saTrack } from '../../../utils/helpers'
import PayInfo from '../components/PayInfo'
import { sa } from '../../../utils/helpers'
import QuestionCollection from './components/questioncollection/QuestionCollection'

@connect(state => state)
export default class BusinessApplyChoice extends Component<any, any> {
  constructor() {
    super();
    this.state = {
      questionGroup: [],
      seriesCount: 0,
      currentIndex: 0,
      riseId: ""
    }
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentWillMount() {
    let riseId = this.props.location.query.riseId || "";
    this.setState({ riseId: riseId })
  }

  async componentDidMount() {
    const { dispatch, region, location } = this.props;
    // ios／安卓微信支付兼容性
    if(refreshForPay()) {
      return
    }
    const { goodsId } = location.query;
    //查询订单信息
    let orderRes = await getRiseMember(goodsId);
    this.setState({ quanwaiGoods: orderRes.msg.quanwaiGoods });
    saTrack('openApplyChoicePage', {
      goodsId: goodsId
    })
  }

  handlePayedDone(goodsId) {
    mark({ module: '打点', function: '商学院申请', action: '支付成功', memo: goodsId })
    // this.handleClickSubmit()
    this.context.router.push({
      pathname: '/pay/applysubmit',
      query: { goodsId: goodsId }
    });
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
   */
  handleClickOpenPayInfo() {
    this.reConfig()
    const { dispatch } = this.props
    const { quanwaiGoods = {} } = this.state;
    dispatch(startLoad())
    // 先检查是否能够支付
    checkRiseMember(quanwaiGoods.id).then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
        const { qrCode, privilege, errorMsg } = res.msg;
        if(privilege) {
          this.refs.payInfo.handleClickOpen()
        } else {
          dispatch(alertMsg(errorMsg))
        }
      } else {
        dispatch(alertMsg(res.msg))
      }
    }).catch(ex => {
      dispatch(endLoad())
      dispatch(alertMsg(ex))
    })
    mark({ module: '打点', function: '商学院申请', action: '点击加入按钮', memo: quanwaiGoods.id })
  }

  handlePayedBefore() {
    const { quanwaiGoods = {} } = this.state;
    mark({ module: '打点', function: '商学院申请', action: '点击付费', memo: quanwaiGoods.id })
  }

  /**
   * 重新注册页面签名
   */
  reConfig() {
    config([ 'chooseWXPay' ])
  }

  render() {
    const { showErr, showCodeErr, quanwaiGoods = {}, riseId } = this.state

    return (
      <div className="apply-choice" style={{ minHeight: window.innerHeight }}>
        {quanwaiGoods.id && <QuestionCollection header={quanwaiGoods.name} goodsId={quanwaiGoods.id} riseId={riseId}
                                              handleClickOpenPayInfo={() => this.handleClickOpenPayInfo()}/>}
        {showErr ? <div className="pay-tips-mask" onClick={() => this.setState({ showErr: false })}>
          <div className="tips">
            出现问题的童鞋看这里<br/>
            1如果显示“URL未注册”，请重新刷新页面即可<br/>
            2如果遇到“支付问题”，扫码联系小黑，并将出现问题的截图发给小黑<br/>
          </div>
          <img className="xiaoQ" src="https://static.iqycamp.com/images/asst_xiaohei.jpeg?imageslim"/>
        </div> : null}
        {showCodeErr ? <div className="pay-tips-mask" onClick={() => this.setState({ showCodeErr: false })}>
          <div className="tips">
            糟糕，支付不成功<br/>
            原因：微信不支持跨公众号支付<br/>
            怎么解决：<br/>
            1，长按下方二维码，保存到相册；<br/>
            2，打开微信扫一扫，点击右上角相册，选择二维码图片；<br/>
            3，在新开的页面完成支付即可<br/>
          </div>
          <img className="xiaoQ" style={{ width: '50%' }}
               src="https://static.iqycamp.com/images/pay_camp_code.png?imageslim"/>
        </div> : null}
        {quanwaiGoods && <PayInfo ref="payInfo"
                                dispatch={this.props.dispatch}
                                goodsType={quanwaiGoods.goodsType}
                                goodsId={quanwaiGoods.id}
                                header={quanwaiGoods.name}
                                payedDone={(goodsId) => this.handlePayedDone(goodsId)}
                                payedCancel={(res) => this.handlePayedCancel(res)}
                                payedError={(res) => this.handlePayedError(res)}
                                payedBefore={() => this.handlePayedBefore()}
        />}
      </div>
    )
  }
}

