import React, { Component } from 'react';
import { connect } from 'react-redux';
import './BusinessApply.less';
import { set, startLoad, endLoad, alertMsg } from "redux/actions"
import { mark } from "../../../utils/request"
import { SubmitButton } from '../../../components/submitbutton/SubmitButton'
import { checkSubmitApply } from './async';
import Icon from '../../../components/Icon'
import { getGoodsType } from '../../../utils/helpers'
import { getRiseMember, checkRiseMember } from '../async'
import PayInfo from '../components/PayInfo'
import { config } from '../../helpers/JsConfig'

@connect(state => state)
export default class BusinessApply extends Component<any, any> {
  constructor() {
    super();
    this.state = {
      showId: 7,
      showErr: false,
      showCodeErr: false,
    }
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
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

    const { dispatch, location } = this.props
    dispatch(startLoad())
    // 如果用户在审核中，则点击后提示已经在审核中
    mark({ module: "打点", function: "商学院审核", action: "进入申请开始页面" })
    // 查询订单信息
    getRiseMember(this.state.showId).then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
        this.setState({ memberType: res.msg.memberType })
      } else {
        dispatch(alertMsg(res.msg))
      }
    }).catch((err) => {
      dispatch(endLoad())
      dispatch(alertMsg(err))
    })
  }

  goApplySubmitPage() {
    const { dispatch } = this.props;
    // mark({ module: "打点", function: "商学院审核", action: "点击开始申请商学院" })
    dispatch(startLoad());
    checkSubmitApply().then(res => {
      dispatch(endLoad());
      if(res.code === 200) {
        this.context.router.push('/rise/static/business/apply/choice');
      } else {
        dispatch(alertMsg(res.msg));
      }
    }).catch(ex => {
      dispatch(endLoad());
      dispatch(alertMsg(ex));
    })
  }

  handlePayedDone() {
    mark({ module: '打点', function: '商学院申请', action: '支付成功' })
    this.goApplySubmitPage()
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
    checkRiseMember(showId).then(res => {
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
    config(['chooseWXPay'])
  }

  render() {
    const {showErr, showCodeErr, memberType, showId} = this.state

    return (
      <div className="business-apply">
        <div className="ba-header">
          <div className="ba-header-msg">圈外商学院入学申请表</div>
          <div className="ba-header-pic">
            <Icon type="white_book_yellow_bg" width='10rem'/>
          </div>
        </div>
        <div className="ba-main-body">
          <div className="ba-line">欢迎申请圈外商学院！</div>
          <div className="ba-line">每个月我们会收到数以千计的申请，招生委员会将通过<b>电话面试</b>，了解申请人的工作现状和发展目标，综合考虑做出录取和奖学金发放决定，为最具潜力的申请人的职业发展助力！</div>
          <div className="ba-line">招生委员会由圈外创始人、顶尖公司HR构成。申请面试费用¥99，若通过面试，将作为奖学金抵扣学费。若未通过面试，将退回您的账户。</div>
          <div className="ba-line">接下来，我们邀请你填写入学申请。期待你的加入！</div>
        </div>
        <div className="ba-sub-tips">填写须知</div>
        <div className="ba-sub-body">
          申请填写需要3分钟时间，提交后无法修改，请认真填写。
        </div>
        <SubmitButton clickFunc={() => this.handleClickOpenPayInfo(showId)} buttonText="付款并开始申请"/>


        {showErr ? <div className="mask" onClick={() => this.setState({ showErr: false })}>
            <div className="tips">
              出现问题的童鞋看这里<br/>
              1如果显示“URL未注册”，请重新刷新页面即可<br/>
              2如果遇到“支付问题”，扫码联系小黑，并将出现问题的截图发给小黑<br/>
            </div>
            <img className="xiaoQ" src="https://static.iqycamp.com/images/asst_xiaohei.jpeg?imageslim"/>
          </div> : null}
        {showCodeErr ? <div className="mask" onClick={() => this.setState({ showCodeErr: false })}>
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
        {memberType ? <PayInfo ref="payInfo"
                               dispatch={this.props.dispatch}
                               goodsType={getGoodsType(memberType.id)}
                               goodsId={memberType.id}
                               header={memberType.name}
                               payedDone={(goodsId) => this.handlePayedDone()}
                               payedCancel={(res) => this.handlePayedCancel(res)}
                               payedError={(res) => this.handlePayedError(res)}
                               payedBefore={() => this.handlePayedBefore()}
          /> : null}
      </div>
    )
  }
}
