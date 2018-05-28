import React, { Component } from 'react';
import { connect } from 'react-redux';
import './BusinessApply.less';
import { set, startLoad, endLoad, alertMsg } from "redux/actions"
import { mark } from "utils/request"
import { sa } from '../../../utils/helpers'
import RenderInBody from '../../../components/RenderInBody'
import AssetImg from '../../../components/AssetImg'
import { FooterButton } from '../../../components/submitbutton/FooterButton'
import { checkRiseMember, loadApplyProjectInfo } from '../async'

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

  async componentWillMount() {
    // 默认申请核心能力项目
    const { goodsId = '7' } = this.props.location.query;
    let res = await loadApplyProjectInfo({ applyId: goodsId });
    const { apply, wannaGoods } = res.msg;
    this.setState({ memberType: wannaGoods, apply: apply });
    sa.track('openApplyStartPage', {
      goodsId: goodsId
    });
    mark({ module: "商学院审核", function: goodsId, action: "进入申请开始页面", memo: "申请开始页面" })
  }

  async goApplySubmitPage() {
    const { dispatch } = this.props;
    const { goodsId = '7',riseId="" } = this.props.location.query;
    let res =""
    if (riseId){
        res =  await checkRiseMember(goodsId,riseId);
    } else {
        res =  await checkRiseMember(goodsId)
    }
    if(res.code === 200) {
      const { qrCode, privilege, errorMsg, subscribe } = res.msg;
      if(subscribe) {
        // 关注
        if(privilege) {
          sa.track('clickApplyStartButton', {
            goodsId: goodsId
          });
          mark({ module: "商学院审核", function: goodsId, action: "点击开始申请商学院", memo: "申请开始页面" })
            if (riseId){
                window.location.href = `/pay/applychoice?goodsId=${goodsId}&riseId=${riseId}`
            } else {
                window.location.href = `/pay/applychoice?goodsId=${goodsId}`
            }
        } else {
          dispatch(alertMsg(errorMsg));
        }
      } else {
        // 未关注
        this.setState({ qrCode: qrCode, showQr: true });
      }
    } else {
      dispatch(alertMsg(res.msg));
    }
  }

  goExperience() {
    this.context.router.push({
      pathname: '/pay/experience/day'
    })
  }

  render() {
    const { showQr, qrCode, memberType = {}, apply = {} } = this.state;
    const { goodsId = '7' } = this.props.location.query;

    const renderButtons = () => {
      if(goodsId == 7) {
        return <FooterButton primary={true} btnArray={[
          {
            click: () => this.goExperience(),
            text: '申请体验'
          },
          {
            click: () => this.goApplySubmitPage(),
            text: '开始申请'
          }
        ]}/>
      } else {
        return <FooterButton primary={true} btnArray={[
          {
            click: () => this.goApplySubmitPage(),
            text: '开始申请'
          }
        ]}/>
      }

    }
    return (
      <div className="business-apply">
        <div className="ba-header">
          <div className="ba-header-msg">
            { memberType.id === 8 ? "商业思维项目入学申请" : apply.description}
            </div>
          <div className="ba-header-pic">
            <AssetImg url="https://static.iqycamp.com/images/apply_interview.png" size={'9.6rem'}/>
          </div>
        </div>
        <div className="ba-main-body">
          <div className="ba-line">
            { memberType.id === 8 ?
              "感谢你报名申请圈外商学院！还差一步，即可开启体系化提升商业思维和管理能力之路。" :
              "我们每月会收到数以千计的入学申请，招生委员会将通过电话沟通，判断申请人是否符合入学要求，为最具潜力的申请人助力职业发展！"
            }
          </div>
          <div className="ba-line">
            认真填写有助你提升录取机会，更有入学奖学金等你来拿噢。
          </div>
        </div>
        <div className="ba-sub-tips">填写须知</div>
        <div className="ba-sub-body">
          问卷以选择题为主，填写需要3-5分钟
        </div>

        {renderButtons()}
        {!!showQr ? <RenderInBody>
          <div className="qr_dialog">
            <div className="qr_dialog_mask" onClick={() => {
              this.setState({ showQr: false });
            }}>
            </div>
            <div className="qr_dialog_content">
              <span>扫码后可进行申请哦</span>
              <div className="qr_code">
                <img src={qrCode}/>
              </div>
            </div>
          </div>
        </RenderInBody> : null}
      </div>
    )
  }
}
