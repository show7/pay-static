import * as React from 'react'
import './CampPay.less'
import { connect } from 'react-redux'
import { mark } from '../../../utils/request'
import { set, startLoad, endLoad, alertMsg } from '../../../redux/actions'
import PicLoading from '../components/PicLoading'
import { joinCampGroup, isFollowing, getLeaderInfo } from './async'
import { MarkBlock } from '../components/markblock/MarkBlock'
import { configShare } from '../../helpers/JsConfig'
import { SubmitButton } from '../../../components/submitbutton/SubmitButton'

@connect(state => state)
export default class CampPay extends React.Component<any, any> {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor() {
    super()
    this.state = {
      data: {}
    }
  }

  async componentWillMount() {
    const { dispatch, location } = this.props
    const { groupCode, share } = location.query

    let res = await getLeaderInfo(groupCode)

    const { msg, code } = res
    if(code === 200) {
      this.setState({ data: msg })
    } else {
      dispatch(alertMsg(msg))
    }

    if(share) {
      configShare(
        '我想邀请你一起，用7天时间分析出真正的自己', `https://${window.location.hostname}/pay/static/camp/group?groupCode=${groupCode}`,
        'https://static.iqycamp.com/images/team_promotion_share.jpg?imageslim',
        ''
      )
    }

    this.setState({ groupCode, share })
    mark({ module: '打点', function: '小课训练营', action: '参团', memo: groupCode })
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
        window.location.href = '/rise/static/camp'
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
    const { loading, groupCode, show, data } = this.state
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
          <div className="friend-headimg-container" style={{background:`url(${headimgurl}) no-repeat  center center/100% auto`}}>
          </div>
          <div className="welcome-words">
            {nickname}邀请你一起学习
          </div>
          <div className="welcome-words" style={{marginBottom:50}}>
            《认识自己|用冰山模型，分析出真实的你》
          </div>
          <div className="rule-words">
            <ul>
              <li>7天免费试学，名额有限，报满为止，结束后可以选择是否付费继续参加课程。</li>
              <li>如果好奇，就快和优秀的朋友相约，一起挖掘隐藏优势，认识另一个自己</li>
            </ul>
          </div>
        </div>
      )
    }

    const renderPay = () => {
      return (
        <div className="pay-page">
          <img className="sale-pic" style={{ width: '100%' }}
               src="https://static.iqycamp.com/images/fragment/camp_promotion_01_6.png?imageslim"
               onLoad={() => this.setState({ loading: false })}/>
          <MarkBlock module={'打点'} func={'小课训练营'}
                     action={'接受邀请'}>
            <SubmitButton clickFunc={()=>this.handleJoinGroup(groupCode)} buttonText={'接受邀请'}/>
          </MarkBlock>
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
            <img src="https://static.iqycamp.com/images/promotion_camp_1_2.png?imageslim" width={'100%'}></img>
          </div>
        }
      </div>
    )
  }
}
