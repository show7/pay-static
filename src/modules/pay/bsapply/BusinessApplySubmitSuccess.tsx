import React, { Component } from 'react';
import { connect } from 'react-redux';
import './BusinessApply.less';
import { set, startLoad, endLoad, alertMsg } from "redux/actions"
import * as _ from 'lodash';
import { mark } from "utils/request"
import { SubmitButton } from '../../../components/submitbutton/SubmitButton'
import { checkSubmitApply } from './async';
import { closeWindow } from '../../helpers/JsConfig'
import Icon from '../../../components/Icon'

@connect(state => state)
export default class BusinessApplySubmitSuccess extends Component<any, any> {
  constructor() {
    super();
    this.state = {}
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentWillMount() {
    // 如果用户在审核中，则点击后提示已经在审核中
    mark({ module: "打点", function: "商学院审核", action: "进入提交成功页面" })
  }

  handleClickClosePage() {
    closeWindow();
  }

  render() {
    return (
      <div className="business-apply submit-success">
        <div className="ba-header">
          <div className="ba-header-msg">感谢提交圈外商学院申请</div>
          <div className="ba-header-pic">
            <Icon type="phone_interview_ok" width='100px'/>
          </div>
        </div>
        <div className="ba-main-body">
          扫码添加圈外招生委员会老师，即可获得:<br/><br/>

          <div className="middle-words">
            1. 商学院全年课表<br/>
            2. 面试指南<br/>
            3. 奖学金政策说明<br/><br/>
          </div>


          {/*您会在两个工作日内<br/>*/}
          {/*通过手机短信和微信公众号【圈外同学】 <br/>*/}
          {/*收取录取和奖学金审核结果*/}
        </div>
        <div className="ba-sub-tips">
          <div className="small-tips">
            工作时间4小时内回复<br/>
            （周一到周五10：00-20：00）<br/><br/>
          </div>
          <img src="https://static.iqycamp.com/images/qrcode_qwzswyh.jpeg?imageslim"
               className="qrcode"/>
        </div>
        <SubmitButton clickFunc={() => this.handleClickClosePage()} buttonText="关闭"/>
      </div>
    )
  }
}
