import React, { Component } from 'react';
import { connect } from 'react-redux';
import './BusinessApply.less';
import { set, startLoad, endLoad, alertMsg } from "redux/actions"
import { mark } from "utils/request"
import { SubmitButton } from '../../../components/submitbutton/SubmitButton'
import { checkSubmitApply } from './async';
import Icon from '../../../components/Icon'


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
          <div className="ba-header-msg">圈外商学院入学沟通预约</div>
          <div className="ba-header-pic">
            <Icon type="phone_interview" width='10rem'/>
          </div>
        </div>
        <div className="ba-main-body">
          <div className="ba-line">欢迎申请圈外商学院！</div>
          <div className="ba-line">我们每月会收到数以千计的入学申请，招生委员会将通过电话沟通，判断申请人是否符合入学要求，为最具潜力的申请人助力职业发展！</div>
          <div className="ba-line">接下来，我们邀请你完成若干选择题，以便了解你的情况，在电话沟通中，为你提供个性化的提升建议。期待你的加入！</div>
        </div>
        <div className="ba-sub-tips">填写须知</div>
        <div className="ba-sub-body">
          共8道选择题，约3分钟时间完成。
        </div>
        <SubmitButton clickFunc={() => this.goApplySubmitPage()} buttonText="开始预约"/>
      </div>
    )
  }
}
