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

import { config } from '../../helpers/JsConfig'
import * as _ from 'lodash';

@connect(state => state)
export default class BusinessApply extends Component<any, any> {
  constructor() {
    super();
    this.state = {
      showErr: false,
      showCodeErr: false,
    }
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentWillMount() {
    // // ios／安卓微信支付兼容性
    // if(window.ENV.configUrl != '' && window.ENV.configUrl !== window.location.href) {
    //   ppost('/b/mark', {
    //     module: 'RISE',
    //     function: '打点',
    //     action: '刷新支付页面',
    //     memo: window.ENV.configUrl + '++++++++++' + window.location.href
    //   })
    //   window.location.href = window.location.href
    //   return
    // }

    // 如果用户在审核中，则点击后提示已经在审核中
    mark({ module: "打点", function: "商学院审核", action: "进入申请开始页面" })
  }

  goApplySubmitPage() {
    const { dispatch } = this.props;
    // mark({ module: "打点", function: "商学院审核", action: "点击开始申请商学院" })
    dispatch(startLoad());
    checkSubmitApply().then(res => {
      dispatch(endLoad());
      if(res.code === 200) {
        this.context.router.push('/pay/applychoice');
      } else {
        dispatch(alertMsg(res.msg));
      }
    }).catch(ex => {
      dispatch(endLoad());
      dispatch(alertMsg(ex));
    })
  }


  render() {
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
          <div className="ba-line">每个月我们会收到数以千计的申请，招生委员会将通过<b>电话面试</b>，了解申请人的工作现状和发展目标，综合考虑后做出录取和奖学金发放的决定，为最具潜力的申请人的职业发展助力！</div>
          {/*<div className="ba-line">招生委员会由圈外创始人团队和顶级公司HR等权威专家构成，电话面试的同时，也会帮助申请人梳理职业发展问题，给出学习和提升的建议。因此我们会收取¥99的面试费用，若通过面试，将作为奖学金抵扣学费。若未通过面试，将退回您的账户。</div>*/}
          <div className="ba-line">接下来，我们邀请你填写入学申请。期待你的加入！</div>
        </div>
        <div className="ba-sub-tips">填写须知</div>
        <div className="ba-sub-body">
          申请填写需要3分钟时间，提交后无法修改，请认真填写。
        </div>
        <SubmitButton clickFunc={() => this.goApplySubmitPage()} buttonText="开始申请"/>
      </div>
    )
  }
}
