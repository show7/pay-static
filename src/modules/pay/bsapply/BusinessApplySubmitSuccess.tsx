import React, { Component } from 'react';
import { connect } from 'react-redux';
import './BusinessApply.less';
import { set, startLoad, endLoad, alertMsg } from "redux/actions"
import * as _ from 'lodash';
import { mark } from "../../../utils/request"
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
            <Icon type="white_book_black_bg" width='100px'/>
          </div>
        </div>
        <div className="ba-main-body">
          我们会在两个工作日内<br/>
          根据您留下的手机/微信联系方式，对您进行远程面试。
        </div>
        <div className="ba-sub-tips">
          如有疑问，请添加圈外助手进行咨询<br/>
          <img src="https://static.iqycamp.com/images/qrcode_xiaoy_20171117.jpeg?imageslim"
               className="qrcode"/>
        </div>
        <SubmitButton clickFunc={() => this.handleClickClosePage()} buttonText="关闭"/>
      </div>
    )
  }
}
