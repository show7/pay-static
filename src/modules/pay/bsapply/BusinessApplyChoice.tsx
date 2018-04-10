import React, { Component } from 'react';
import { connect } from 'react-redux';
import './BusinessApplyChoice.less';
import { set, startLoad, endLoad, alertMsg } from "redux/actions"
import * as _ from 'lodash';
import { mark } from "utils/request"
import { getRiseMember, checkRiseMember } from '../async'
import { config } from '../../helpers/JsConfig'
import { getGoodsType, refreshForPay } from '../../../utils/helpers'
import PayInfo from '../components/PayInfo'
import { sa } from '../../../utils/helpers'
import QuestionCollection from './components/questioncollection/QuestionCollection'

@connect(state => state)
export default class BusinessApplyChoice extends Component<any, any> {
  constructor() {
    super();
    this.state = {
      showId: 7,
      questionGroup: [],
      seriesCount: 0,
      currentIndex: 0,
    }
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentWillMount() {
    const { goodsId } = this.props.location.query;
    this.setState({ showId: goodsId });
  }

  async componentDidMount() {
    const { dispatch, region, location } = this.props;
    // ios／安卓微信支付兼容性
    if(refreshForPay()) {
      return
    }
    const { goodsId } = location.query;
    //查询订单信息
    let orderRes = await getRiseMember(this.state.showId);
    this.setState({ memberType: orderRes.msg.memberType });

    sa.track('openApplyChoicePage', {
      goodsId: goodsId
    });
  }

  handlePayedDone() {
    mark({ module: '打点', function: '商学院申请', action: '支付成功' })
    // this.handleClickSubmit()
    this.context.router.push('/pay/applysubmit');
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
  handleClickOpenPayInfo() {
    this.reConfig()
    const { dispatch } = this.props
    dispatch(startLoad())
    // 先检查是否能够支付
    checkRiseMember(this.state.showId).then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
        // 查询是否还在报名
        this.refs.payInfo.handleClickOpen()
      } else {
        dispatch(alertMsg(res.msg))
      }
    }).catch(ex => {
      dispatch(endLoad())
      dispatch(alertMsg(ex))
    })
    mark({ module: '打点', function: '商学院申请', action: '点击加入按钮' })
  }

  handlePayedBefore() {
    mark({ module: '打点', function: '商学院申请', action: '点击付费' })
  }

  /**
   * 重新注册页面签名
   */
  reConfig() {
    config([ 'chooseWXPay' ])
  }

  render() {
    const { showErr, showCodeErr, memberType } = this.state
    const { goodsId = '7' } = this.props.location.query;

    return (
      <div className="apply-choice" style={{ minHeight: window.innerHeight }}>
        <QuestionCollection goodsId={goodsId} handleClickOpenPayInfo={() => this.handleClickOpenPayInfo()}/>
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
        {memberType && <PayInfo ref="payInfo"
                                dispatch={this.props.dispatch}
                                goodsType={getGoodsType(memberType.id)}
                                goodsId={memberType.id}
                                header={memberType.name}
                                payedDone={(goodsId) => this.handlePayedDone()}
                                payedCancel={(res) => this.handlePayedCancel(res)}
                                payedError={(res) => this.handlePayedError(res)}
                                payedBefore={() => this.handlePayedBefore()}
        />}
      </div>
    )
  }
}

