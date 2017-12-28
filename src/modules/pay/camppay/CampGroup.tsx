import * as React from 'react'
import './CampPay.less'
import { connect } from 'react-redux'
import { mark } from '../../../utils/request'
import { set, startLoad, endLoad, alertMsg } from '../../../redux/actions'
import PicLoading from '../components/PicLoading'
import { joinCampGroup, isFollowing, getLeaderInfo } from './async'
import { getRiseMember, checkRiseMember } from '../async'
import { MarkBlock } from '../components/markblock/MarkBlock'
import { configShare } from '../../helpers/JsConfig'
import { getGoodsType } from '../../../utils/helpers'
import PayInfo from '../components/PayInfo'
import { SubmitButton } from '../../../components/submitbutton/SubmitButton'

@connect(state => state)
export default class CampPay extends React.Component<any, any> {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor() {
    super()
    this.state = {
      data: {},
      showId: 5,
      memberType: {},
    }
  }

  async componentWillMount() {
    const { dispatch, location } = this.props
    const { groupCode, share } = location.query

    // 查询订单信息
    let res = await getRiseMember(this.state.showId)
    dispatch(endLoad())
    if(res.code === 200) {
      this.setState({ memberType: res.msg.memberType })
    } else {
      dispatch(alertMsg(res.msg))
    }

    res = await getLeaderInfo(groupCode)

    const { msg, code } = res
    if(code === 200) {
      this.setState({ data: msg })
    } else {
      dispatch(alertMsg(msg))
    }

    configShare(
      '我想邀请你一起，用7天时间重新认识自己', `https://${window.location.hostname}/pay/static/camp/group?groupCode=${groupCode}`,
      'https://static.iqycamp.com/images/team_promotion_share.jpg?imageslim',
      '揭晓价值观和能力的隐藏区', ['chooseWXPay']
    )

    this.setState({ groupCode, share })
    mark({ module: '打点', function: '小课训练营', action: '参团', memo: groupCode })
  }

  /**
   * 打开支付窗口
   * @param showId 会员类型id
   */
  async handleClickOpenPayInfo(showId) {
    // this.reConfig()
    const { dispatch } = this.props
    dispatch(startLoad())
    // 先检查是否能够支付
    let res = await checkRiseMember(showId)
    dispatch(endLoad())
    if(res.code === 200) {
      // 查询是否还在报名
      this.refs.payInfo.handleClickOpen()
    } else if(res.code === 214) {
      this.setState({ timeOut: true })
    } else {
      dispatch(alertMsg(res.msg))
    }
  }

  handlePayedDone() {
    mark({ module: '打点', function: '小课训练营', action: '参团人员支付成功', memo: this.state.currentCampMonth })
    this.context.router.push({
      pathname: '/pay/camp/success',
      query: {
        memberTypeId: 5
      }
    })
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

  handlePayedBefore() {
    mark({ module: '打点', function: '小课训练营', action: '参团人员点击付费', memo: this.state.currentCampMonth })
  }

  async handleJoinGroup(groupCode) {
    const { dispatch } = this.props
    dispatch(startLoad())
    // 先检查是否能够支付
    let res = await isFollowing(groupCode)
    if(res.code === 200) {
      res = await joinCampGroup(groupCode)
      dispatch(endLoad())
      if(res.code === 200) {
        window.location.href = '/rise/static/group/promotion/count/down'
      } else {
        dispatch(alertMsg(res.msg))
      }
    } else if(res.code === 201) {
      dispatch(endLoad())
      this.setState({ url: res.msg.replace('\\n', ''), show: true })
      document.querySelector('.camp-pay-container').style.overflow = 'hidden'
    } else {
      dispatch(endLoad())
      dispatch(alertMsg(res.msg))
    }
  }

  render() {
    const { loading, groupCode, show, data, showId, timeOut, showErr, showCodeErr, memberType } = this.state
    const { nickname, headimgurl }  = data
    const { location } = this.props
    const { share } = location.query

    const renderWelcome = () => {
      return (
        <div className="welcome-card">
          <div className="left-up-border"></div>
          <div className="right-up-border"></div>
          <div className="left-bottom-border"></div>
          <div className="right-bottom-border"></div>
          <div className="friend-headimg-container"
               style={{background:`url(${headimgurl}) no-repeat  center center/100% auto`}}>
          </div>
          <div className="welcome-words-first">
            {nickname}邀请你一起学习
          </div>
          <div className="welcome-words-second" style={{marginBottom:50, marginTop: 20}}>
            《认识自己：用冰山模型，分析出真实的你》
          </div>
          <div className="rule-words">
            接受邀请，免费解锁前7天的课程内容！名额有限，报满为止。
          </div>
        </div>
      )
    }

    const renderPay = () => {
      return (
        <div className="pay-page">
          <img className="sale-pic" style={{ width: '100%' }}
               src="https://static.iqycamp.com/images/fragment/camp_promotion_01_9.png?imageslim"
               onLoad={() => this.setState({ loading: false })}/>
          <div className="button-footer">
            <MarkBlock module={'打点'} func={'小课训练营'}
                       action={'点击加入按钮'} memo={this.state.currentCampMonth}
                       className='footer-left' onClick={() => this.handleClickOpenPayInfo(showId)}>
              单人模式(¥498)
            </MarkBlock>
            <MarkBlock module={'打点'} func={'小课训练营'} action={'接受邀请'}
                       className={'footer-btn'} onClick={()=>this.handleJoinGroup(groupCode)}>
              接受邀请（7天免费）
            </MarkBlock>
          </div>
        </div>
      )
    }

    return (
      <div className="camp-pay-container">
        <PicLoading show={loading}/>
        {renderWelcome()}
        {renderPay()}
        {
          show &&
          <div className="alert-container" onClick={() => this.setState({ show: false })}>
            <div className="subscribe-modal">
              <div className="subscribe-qrcode"><img src={this.state.url} width={110} height={110}></img></div>
            </div>
          </div>
        }
        {
          share &&
          <div className="alert-container">
            <img src="https://static.iqycamp.com/images/promotion_camp_1_3.png?imageslim" width={'100%'}></img>
          </div>
        }

        {timeOut && <div className="mask" onClick={() => {window.history.back()}}
                         style={{ background: 'url("https://static.iqycamp.com/images/riseMemberTimeOut.png?imageslim") center center/100% 100%' }}>
        </div>}
        {showErr && <div className="mask" onClick={() => this.setState({ showErr: false })}>
          <div className="tips">
            出现问题的童鞋看这里<br/>
            1如果显示“URL未注册”，请重新刷新页面即可<br/>
            2如果遇到“支付问题”，扫码联系小黑，并将出现问题的截图发给小黑<br/>
          </div>
          <img className="xiaoQ" src="https://static.iqycamp.com/images/asst_xiaohei.jpeg?imageslim"/>
        </div>}
        {showCodeErr && <div className="mask" onClick={() => this.setState({ showCodeErr: false })}>
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
        </div>}
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
