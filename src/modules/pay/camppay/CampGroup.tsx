import * as React from 'react'
import './CampPay.less'
import { connect } from 'react-redux'
import { mark } from '../../../utils/request'
import { set, startLoad, endLoad, alertMsg } from '../../../redux/actions'
import PicLoading from '../components/PicLoading'
import { joinCampGroup, isFollowing } from './async'
import { MarkBlock } from '../components/markblock/MarkBlock'
import { Dialog } from "react-weui"
const { Alert } = Dialog

@connect(state => state)
export default class CampPay extends React.Component<any, any> {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor() {
    super()
    this.state = {
      data: {},
    }
  }

  async componentWillMount() {
    const { dispatch, location } = this.props
    const { groupCode } = location.query
    this.setState({ groupCode })
    mark({ module: '打点', function: '小课训练营', action: '参团', memo: groupCode })
  }

  async handleJoinGroup(groupCode) {
    const { dispatch } = this.props
    dispatch(startLoad())
    // 先检查是否能够支付
    let res = await isFollowing()
    if(res.code === 200) {
      res = await joinCampGroup(groupCode)
      dispatch(endLoad())
      if(res.code === 200) {
        window.location.href = '/rise/static/camp'
      } else {
        dispatch(alertMsg(res.msg))
      }
    } else {
      dispatch(endLoad())
      this.context.router.push(`/subscribe?qrCode=groupPromotion_${groupCode}`)
    }
  }

  render() {
    const { loading, groupCode } = this.state

    const renderPay = () => {
      return (
        <div className="pay-page">
          <img className="sale-pic" style={{ width: '100%' }}
               src="https://static.iqycamp.com/images/fragment/camp_promotion_01_6.png?imageslim"
               onLoad={() => this.setState({ loading: false })}/>
          <MarkBlock module={'打点'} func={'小课训练营'}
                     action={'点击参团按钮'}
                     className='button-footer' onClick={() => this.handleJoinGroup(groupCode)}>
            <div className="footer-btn">参团</div>
          </MarkBlock>
        </div>
      )
    }

    return (
      <div className="camp-pay-container">
        <PicLoading show={loading}/>
        {renderPay()}
      </div>
    )
  }
}
