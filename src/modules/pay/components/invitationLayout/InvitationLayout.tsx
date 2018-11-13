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
          <h3>好友邀请</h3>
          <p>{oldNickName}觉得《{projectName}》很适合你，邀请你成为TA的同学，送你一张{amount}元的{projectName}专属学习优惠券。</p>
          <span className="button"
                onClick={callBack}>知道了</span>
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