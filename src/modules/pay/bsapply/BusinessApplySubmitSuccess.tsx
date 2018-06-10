import React, { Component } from 'react';
import { connect } from 'react-redux';
import './BusinessApplySubmitSuccess.less';
import { set, startLoad, endLoad, alertMsg } from "redux/actions"
import { mark } from "utils/request"
import { FooterButton } from '../../../components/submitbutton/FooterButton'
import { closeWindow } from '../../helpers/JsConfig'
import Icon from '../../../components/Icon'
import { loadApplyProjectInfo } from '../async'

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
    let res = await loadApplyProjectInfo({ applyId: goodsId });
    const { apply, wannaGoods } = res.msg;
    this.setState({ projectName: wannaGoods.description })
    mark({ module: "打点", function: "商学院审核", action: "进入提交成功页面", memo: wannaGoods.id })
  }

  handleClickClosePage() {
    closeWindow();
  }

  render() {
    const { goodsId = '7' } = this.props.location.query;
    // const { projectName = '' } = this.state; 临时修改
    const projectName = '圈外商学院';
    return (
      <div className="business-apply-submit submit-success">
        <div className="ba-header">
          <div className="ba-header-msg">感谢提交{projectName}申请</div>
          <div className="ba-header-pic">
            <Icon type="phone_interview_ok" width='100px'/>
          </div>
        </div>
        <div className="ba-main-body">
          扫码添加圈外招生委员会老师<br/>

          <div className="middle-words">
            {goodsId=='9' ?'即可：':'即可获得:'} <br/>
            {goodsId=='9' ?'1. 咨询申请结果':'1. 面试指南'} <br/>
           {goodsId=='9' ?'2. 企业采购咨询':'2. 商学院课表'} <br/>
            3. 奖学金政策说明<br/><br/>
          </div>
        </div>
        <div className="ba-sub-tips">
          <div className="small-tips">
            工作时间<span style={{ fontWeight: 300 }}>4</span>小时内回复<br/>
            （周一到周五<span style={{ fontWeight: 300 }}>10：00-20：00</span>）<br/><br/>
          </div>
          <img src="https://static.iqycamp.com/images/qrcode_qwzswyh.jpeg?imageslim"
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
