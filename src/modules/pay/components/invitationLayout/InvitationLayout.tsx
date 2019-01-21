import * as React from 'react'

import './InvitationLayout.less'

export default class InvitationLayout extends React.Component {
  constructor () {
    super()
    this.state = {}
  }

  render () {
    const { oldNickName, projectName, amount, callBack } = this.props
    return (
      <div className="invitation-layout">
        <div className="layout-box">
          <h3>限时优惠券</h3>
          <p>{amount}元奖学金，48小时后过期</p>
          <span className="button"
                onClick={callBack}>点击领取</span>
        </div>
      </div>
    )
  }
}

InvitationLayout.propTypes = {
  oldNickName: React.PropTypes.string, // 邀请人昵称
  projectName: React.PropTypes.string, // 项目名称
  amount: React.PropTypes.number, // 金额数目
  callback: React.PropTypes.func, // 回调函数
}