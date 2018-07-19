import * as React from 'react'
import Mask from '../../../../../components/mask/Mask'
import { loadShareOperationStatus, receiveShareCoupon } from '../../async'
import { GreenDialog } from '../../../../../components/greendialog/GreenDialog'
import { connect } from 'react-redux'
import { set, startLoad, endLoad, alertMsg } from 'redux/actions'

/**
 * 投资圈外项目，优惠券领取弹框
 */
@connect(state => state)
export default class OperationShare extends React.Component {

  constructor() {
    super()
    this.state = {
      showInvitation: false,
    }
  }

  async componentDidMount() {
    const { riseId, dispatch } = this.props
    // let shareStatus = await loadShareOperationStatus(riseId)
    // console.log(shareStatus)
    let showDialog = true;//isAuthority && !isReceivedCoupon;
    if(showDialog) {
      this.setState({
        isAuthority: true,//是否有资格领取优惠券
        isReceivedCoupon: false, //是否已经领取过优惠券
        promoterName: '解决问题', //推广人名称
        projectName: '解决问题', // 项目名称
        amount: 50,// 优惠券金额
        showDialog: true
      }, () => {
        let receiveRes = receiveShareCoupon(riseId);
        if(receiveRes.code !== 200) {
          dispatch(alertMsg(receiveRes.msg));
        }
      })
    } else {
      dispatch(alertMsg('你已领取过优惠券，不可重复领取哦~'))
    }

  }

  // oldNickName: React.PropTypes.string, // 邀请人昵称
  // projectName: React.PropTypes.string, // 项目名称
  // amount: React.PropTypes.number, // 金额数目
  // callback: React.PropTypes.func, // 回调函数

  closeDialog() {
    this.setState({ showDialog: false });
  }

  render() {

    const {
      isAuthority,
      isReceivedCoupon,
      promoterName,
      projectName,
      amount,
      callback,
      showDialog
    } = this.state

    return (
      <div className="operation-share-component">
        <div className="operation-share-block">
          {
            (showDialog) &&
            <GreenDialog title={`${amount}元`}
                         btnStr='知道了'
                         content='恭喜你获得专项课优惠券<br>现在报名即可减免学费'
                         callback={() => this.closeDialog()}/>
          }
        </div>
      </div>
    )
  }

}