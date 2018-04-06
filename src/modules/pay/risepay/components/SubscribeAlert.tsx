import * as React from 'react'
import './SubscribeAlert.less'
import AssetImg from '../../../../components/AssetImg'
import { lockWindow, unlockWindow } from 'utils/helpers'

interface SubscribeAlertProps {
  closeFunc: any
}

export class SubscribeAlert extends React.Component<SubscribeAlertProps, any> {

  constructor () {
    super()
    this.state = {}
  }

  componentWillMount () {
    lockWindow()
    this.setState({
      show: this.props.show,
      closeFunc: this.props.closeFunc,
    })
  }

  componentWillReceiveProps (nextProps) {
    if (JSON.stringify(nextProps) !== JSON.stringify(this.props)) {
      this.setState({
        show: nextProps.show,
        closeFunc: nextProps.closeFunc,
      })
    }
  }

  componentWillUnmount () {
    unlockWindow()
  }

  render () {
    const { closeFunc = () => {} } = this.state

    return (
      <div className="subscribe-alert-component">
        <div className="content-box">
          <AssetImg className="subscribe-success" url="http://static.iqycamp.com/subscribe_success-lu5oeic1.png"/>
          <div className="success-content">恭喜你已
            <span className="orange">预约成功！</span>
          </div>
          <div className="add-tip">
            长按扫码添加
            <br/>
            圈外小U（ID：quanwaixiaou）
            <br/>
            回复【商学院】，领取<span className="orange">课程学习资料包</span>
          </div>
          <AssetImg className="qrcode" url="https://static.iqycamp.com/images/qrcode_xiaou.jpg?imageslim"/>
        </div>
        <AssetImg className="close-icon"
                  url="http://static.iqycamp.com/subscribe_icon_close-2vyuissf.png"
                  onClick={() => closeFunc()}/>
      </div>
    )
  }

}
