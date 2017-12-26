import * as React from 'react'
import './CampPay.less'
import { connect } from 'react-redux'
import { mark } from '../../../utils/request'
import { set, startLoad, endLoad, alertMsg } from '../../../redux/actions'
import PicLoading from '../components/PicLoading'
import { joinCampGroup, isFollowing } from './async'
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
    setTimeout(() => {
      if(share) {
        configShare(
          '我想和你一起，做一次自我认知实验', `https://${window.location.hostname}/pay/static/camp/group?groupCode=${groupCode}`,
          'https://static.iqycamp.com/images/team_promotion_share.jpg?imageslim',
          '2018年，我要做一个全新的自己'
        )
      }
    }, 0)

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
    const { loading, groupCode, show } = this.state
    const { location } = this.props
    const { share } = location.query

    const renderPay = () => {
      return (
        <div className="pay-page">
          <img className="sale-pic" style={{ width: '100%' }}
               src="https://static.iqycamp.com/images/fragment/camp_promotion_01_6.png?imageslim"
               onLoad={() => this.setState({ loading: false })}/>
          <MarkBlock module={'打点'} func={'小课训练营'}
                     action={'点击参团按钮'}>
            <SubmitButton clickFunc={()=>this.handleJoinGroup(groupCode)} buttonText={'加入自我认识实验'} />
          </MarkBlock>
        </div>
      )
    }

    return (
      <div className="camp-pay-container">
        <PicLoading show={loading}/>
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
            <div style={{ marginLeft: (window.innerWidth - 290) / 2 }}>
              <img src="https://static.iqycamp.com/images/promotion_camp_1_1.png?imageslim" width={311}></img>
            </div>
          </div>
        }
      </div>
    )
  }
}
