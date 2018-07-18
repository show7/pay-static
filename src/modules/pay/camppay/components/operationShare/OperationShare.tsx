import * as React from 'react'
import Mask from '../../../../../components/mask/Mask'
import InvitationLayout from '../../../components/invitationLayout/InvitationLayout'
import { loadShareOperationStatus } from '../../async'

/**
 * 投资圈外项目，优惠券领取弹框
 */
export default class OperationShare extends React.Component {

  constructor () {
    super()
    this.state = {
      showInvitation: false,
    }
  }

  async componentDidMount () {
    const { riseId } = this.props
    let shareStatus = await loadShareOperationStatus(riseId)
    console.log(shareStatus)

  }

  // oldNickName: React.PropTypes.string, // 邀请人昵称
  // projectName: React.PropTypes.string, // 项目名称
  // amount: React.PropTypes.number, // 金额数目
  // callback: React.PropTypes.func, // 回调函数
  render () {

    const {
      oldNickName,
      projectName,
      amount,
      callback,
      showInvitation
    } = this.state

    return (
      <div className="operation-share-component">
        <div className="operation-share-block">
          {
            showInvitation &&
            <InvitationLayout oldNickName={}
                              projectName={}
                              amount={}
                              callback={() => {
                              }}/>
          }
        </div>
        <Mask/>
      </div>
    )
  }

}