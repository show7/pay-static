import React, { Component } from 'react';
import { connect } from 'react-redux';
import './BusinessApplySubmitSuccess.less';
import { set, startLoad, endLoad, alertMsg } from "redux/actions"
import { mark } from "utils/request"
import { FooterButton } from '../../../components/submitbutton/FooterButton'
import { closeWindow } from '../../helpers/JsConfig'
import Icon from '../../../components/Icon'
import { loadWannaMember } from '../async'

@connect(state => state)
export default class BusinessApplySubmitSuccess extends Component<any, any> {
  constructor() {
    super();
    this.state = {}
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  async componentWillMount() {
    // 如果用户在审核中，则点击后提示已经在审核中
    const { goodsId = '7' } = this.props.location.query;

    let res = await loadWannaMember(goodsId);
    this.setState({ projectName: res.msg.description })
    mark({ module: "打点", function: "商学院审核", action: "进入提交成功页面", memo: res.msg.id })
  }

  handleClickClosePage() {
    closeWindow();
  }

  render() {
    return (
      <div className="business-apply-submit submit-success">
        <div className="ba-header">
          <div className="ba-header-msg">感谢提交圈外商学院申请</div>
          <div className="ba-header-pic">
            <Icon type="phone_interview_ok" width='100px'/>
          </div>
        </div>
        <div className="ba-main-body">
          扫码添加圈外招生委员会老师<br/>

          <div className="middle-words">
            即可<br/>
            1.咨询申请问题<br/>
            2.企业采购咨询<br/><br/>
          </div>
        </div>
        <div className="ba-sub-tips">
          <div className="small-tips">
            咨询的同学较多，请大家不要急哦~<br/>
            （申请结果请留意圈外同学公众号后台）<br/><br/>
          </div>
          <img src="https://static.iqycamp.com/images/qrcode_qwzswyh_0611.jpeg?imageslim"
               className="qrcode"/>
        </div>
        <FooterButton primary={true} btnArray={[
          {
            click: () => this.handleClickClosePage(),
            text: '关闭'
          }
        ]}/>
      </div>
    )
  }
}
