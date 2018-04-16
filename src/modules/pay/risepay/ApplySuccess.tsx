import * as React from 'react'
import * as _ from 'lodash'
import { ppost, pget, mark } from 'utils/request'
import { set, startLoad, endLoad, alertMsg } from 'redux/actions'
import { connect } from 'react-redux'
import { config } from 'modules/helpers/JsConfig'
import './ApplySuccess.less'
import { getGoodsType, refreshForPay, sa } from 'utils/helpers'
import PayInfo from '../components/PayInfo'
import { checkRiseMember, getRiseMember, loadApplyProjectInfo } from '../async'
import AssetImg from '../../../components/AssetImg'
import { FooterButton } from '../../../components/submitbutton/FooterButton'
import RenderInBody from '../../../components/RenderInBody'
import { Dialog } from 'react-weui'

@connect(state => state)
export default class ApplySuccess extends React.Component<any, any> {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor() {
    super()
    this.state = {
      showId: 3,
      timeOut: false,
      showErr: false,
      showCodeErr: false,
      data: {},
      more: false,
      remainSecond: 0,
      remainMinute: 0,
      remainHour: 0
    }
  }

  formatSeconds(value: number): { remainHour, remainMinute, remainSecond } {
    var remainSecond = parseInt(value);// 秒
    var remainMinute = 0;// 分
    var remainHour = 0;// 小时
    if(remainSecond > 60) {
      remainMinute = parseInt(remainSecond / 60);
      remainSecond = parseInt(remainSecond % 60);
      if(remainMinute > 60) {
        remainHour = parseInt(remainMinute / 60);
        remainMinute = parseInt(remainMinute % 60);
      }
    }
    if(remainSecond <= 0) {
      remainSecond = 0;
    }

    return { remainHour, remainMinute, remainSecond };
  }

  componentWillMount() {
    if(refreshForPay()) {
      return;
    }
    const { goodsId = '3' } = this.props.location.query;

    mark({ module: '打点', function: '商学院会员', action: '购买商学院会员', memo: '申请成功页面' })
    sa.track('openPayPage', {
      goodsType: getGoodsType(Number(goodsId)),
      goodsId: goodsId
    })

    const { dispatch } = this.props
    dispatch(startLoad())
    this.setState({ showId: Number(goodsId) });

    // 查询订单信息
    getRiseMember(goodsId).then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
        const { remainSeconds } = res.msg;
        const remainInfo = this.formatSeconds(remainSeconds);
        this.setState({
          data: res.msg, remainHour: remainInfo.remainHour, remainMinute: remainInfo.remainMinute,
          remainSecond: remainInfo.remainSecond, remainSeconds: remainSeconds
        }, () => {
          if(this.remainInterval) {
            clearInterval(this.remainInterval);
          } else {
            setInterval(() => {
              this.countDown();
            }, 1000)
          }
        })
      } else {
        dispatch(alertMsg(res.msg))
      }
    }).catch((err) => {
      dispatch(endLoad())
      dispatch(alertMsg(err))
    });

    loadApplyProjectInfo({ wannaGoodsId: goodsId }).then(res => {
      if(res.code === 200) {
        const { applyId, wannaGoodsId } = res.msg;
        this.setState({ applyId: applyId, wannaGoodsId: wannaGoodsId });
      }
    })

  }

  handlePayedDone() {
    mark({ module: '打点', function: '商学院会员', action: '支付成功' })
    this.context.router.push({
      pathname: '/pay/member/success',
      query: {
        memberTypeId: this.state.showId
      }
    })
  }

  handleClickIntro() {
    this.setState({ more: true })
  }

  countDown() {
    let { remainSeconds } = this.state;
    if(remainSeconds <= 0) {
      this.setState({ expired: true, remainHour: 0, remainMinute: 0, remainSeconds: 0 }, () => {
        if(this.remainInterval) {
          clearInterval(this.remainInterval);
        }
      })
    } else {
      let remainInfo = this.formatSeconds(remainSeconds - 1);
      this.setState({
        remainHour: remainInfo.remainHour, remainMinute: remainInfo.remainMinute, remainSecond: remainInfo.remainSecond,
        remainSeconds: remainSeconds - 1
      });
    }
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
        const { qrCode, privilege, errorMsg } = res.msg;
        if(privilege) {
          this.refs.payInfo.handleClickOpen()
        } else {
          dispatch(alertMsg(errorMsg));
        }
      }
      else {
        dispatch(alertMsg(res.msg))
      }
    }).catch(ex => {
      dispatch(endLoad())
      dispatch(alertMsg(ex))
    })
  }

  handlePayedBefore() {
    mark({ module: '打点', function: '商学院会员', action: '点击付费' })
  }

  /**
   * 重新注册页面签名
   */
  reConfig() {
    config([ 'chooseWXPay' ])
  }

  handleClickAudition() {
    // 开试听课
    this.context.router.push({
      pathname: '/pay/preacher'
    })
  }

  render() {
    const { data = {}, showId, showErr, showCodeErr, expired, remainSecond, remainHour, remainMinute } = this.state
    const { memberType = {}, tip, privilege } = data

    const renderPay = () => {
      return (
        <FooterButton btnArray={[
          {
            text: '立即入学',
            click: () => this.handleClickOpenPayInfo(showId),
            module: '打点',
            func: showId,
            action: '点击入学按钮',
            memo: '申请成功页面'
          }
        ]}/>
      )
    }

    return (
      <div className="rise-pay-apply-container">
        <div>
          <ApplySuccessCard
            maskPic={memberType.id == 3 ? 'https://static.iqycamp.com/images/fragment/apply_success_3_1.png?imageslim' : 'https://static.iqycamp.com/images/fragment/apply_success_8_1.png?imageslim'}
            privilege={privilege} remainHour={remainHour} remainMinute={remainMinute}
            remainSecond={remainSecond} name={memberType.description}/>

          {renderPay()}
          {
            showErr &&
            <div className="dialog-mask" onClick={() => this.setState({ showErr: false })}>
              <div className="tips">
                出现问题的童鞋看这里<br/>
                1如果显示“URL未注册”，请重新刷新页面即可<br/>
                2如果遇到“支付问题”，扫码联系小黑，并将出现问题的截图发给小黑<br/>
              </div>
              <img className="xiaoQ" src="https://static.iqycamp.com/images/asst_xiaohei.jpeg?imageslim"/>
            </div>
          }
          {
            showCodeErr &&
            <div className="dialog-mask" onClick={() => this.setState({ showCodeErr: false })}>
              <div className="tips">
                糟糕，支付不成功<br/>
                原因：微信不支持跨公众号支付<br/>
                怎么解决：<br/>
                1，长按下方二维码，保存到相册；<br/>
                2，打开微信扫一扫，点击右上角相册，选择二维码图片；<br/>
                3，在新开的页面完成支付即可<br/>
              </div>
              <img className="xiaoQ" style={{ width: '50%' }}
                   src="https://static.iqycamp.com/images/applySuccessCode.png?imageslim"/>
            </div>
          }
          {
            memberType &&
            <PayInfo ref="payInfo"
                     dispatch={this.props.dispatch}
                     goodsType={getGoodsType(memberType.id)}
                     goodsId={memberType.id}
                     header={memberType.name}
                     priceTips={tip}
                     payedDone={(goodsId) => this.handlePayedDone()}
                     payedCancel={(res) => this.handlePayedCancel(res)}
                     payedError={(res) => this.handlePayedError(res)}
                     payedBefore={() => this.handlePayedBefore()}/>
          }
          <Dialog show={expired} buttons={[
            {
              label: '去申请', onClick: () => {
              this.context.router.push({
                pathname: '/pay/bsstart',
                query: {
                  goodsId: this.state.applyId
                }
              });
            }
            }
          ]}>
            您的申请记录已经过期
          </Dialog>

        </div>
      </div>
    )
  }
}

interface ApplySuccessCard {
  remainHour: number,
  remainMinute: number,
  remainSecond: number,
  name: string,
  privilege: boolean,
  maskPic: string,
}

class ApplySuccessCard extends React.Component<ApplySuccessCard, any> {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { name, remainSecond, remainHour, remainMinute, privilege, maskPic } = this.props;
    return (
      <div className="apply-card-wrapper">
        <div className="mask-pic">
          <AssetImg url={maskPic} width='100%'/>
        </div>
        <div className="apply-username">
          {window.ENV.userName}
        </div>
        <div className="remain-time-wrapper">
          <div className="remain-time">
            <div className="big-num hour">
              {privilege ? remainHour : 0}
            </div>
            <div className="big-num minute">
              {privilege ? remainMinute : 0}
            </div>
            <div className="big-num second">
              {privilege ? remainSecond : 0}
            </div>
          </div>
        </div>
      </div>
    )
  }

}
