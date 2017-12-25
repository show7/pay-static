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
      alert: {
        buttons: [
          {
            label: '关闭',
            onClick: ()=>this.setState({show:false})
          }
        ]
      },
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
    let res = await isFollowing(groupCode)
    if(res.code === 200) {
      res = await joinCampGroup(groupCode)
      dispatch(endLoad())
      if(res.code === 200) {
        window.location.href = '/rise/static/camp'
      } else {
        dispatch(alertMsg(res.msg))
      }
    } else if(res.code === 201){
      dispatch(endLoad())
      this.setState({url:res.msg.replace('\\n', ''), show:true})
    } else{
      dispatch(endLoad())
      dispatch(alertMsg(res.msg))
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
            <div className="footer-btn">加入自我认识实验</div>
          </MarkBlock>
        </div>
      )
    }

    return (
      <div className="camp-pay-container">
        <PicLoading show={loading}/>
        {renderPay()}
        <Alert {...this.state.alert} show={this.state.show}>
          <div>长按关注圈外同学，和好友组队解锁前7天实验。</div>
          <div>通过学习和游戏，挖掘天赋优势，人生选择不再迷茫。</div>
          <div style={{marginTop:20}}><img src={this.state.url} width={150} height={150}></img></div>
        </Alert>
      </div>
    )
  }
}
