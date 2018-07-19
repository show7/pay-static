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
      showDialog: false,
      isAuthority: false,
      isReceivedCoupon: false,
      amount: 0,
      projectName: '',
      promoterName: ''
    }
  }

  async componentDidMount() {
    const { riseId, dispatch } = this.props
    let shareStatus = await loadShareOperationStatus(riseId)
    console.log(shareStatus)
    if(shareStatus.code === 200) {
      const {
        isAuthority,
        isReceivedCoupon,
        amount,
        projectName,
        promoterName
      } = shareStatus.msg;
      if(isAuthority) {
        // 有权限领取优惠券
        if(isReceivedCoupon) {
          // 领过优惠券
          dispatch(alertMsg('你已领取过优惠券，不可重复领取哦~'))
        } else {
          // 领取优惠券
          this.setState({
            isAuthority: isAuthority,//是否有资格领取优惠券
            isReceivedCoupon: isReceivedCoupon, //是否已经领取过优惠券
            promoterName: promoterName, //推广人名称
            projectName: projectName, // 项目名称
            amount: amount,// 优惠券金额
            showDialog: true
          }, () => {
            let receiveRes = receiveShareCoupon(riseId);
            if(receiveRes.code !== 200) {
              dispatch(alertMsg(receiveRes.msg));
            }
          })
        }
      } else {
        // 无权限，不做提示
        console.log('无权限，不做提示')
      }
    } else {
      dispatch(alertMsg(shareStatus.msg));
    }
  }

  closeDialog() {
    this.setState({ showDialog: false });
  }

  render() {

    const {
      amount,
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