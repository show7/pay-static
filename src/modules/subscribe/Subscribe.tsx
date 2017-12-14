import * as React from 'react'
import { connect } from 'react-redux'
import { pget } from 'utils/request'
import { startLoad, endLoad, alertMsg } from 'redux/actions'
import './Subscribe.less'

@connect(state => state)
export default class Subscribe extends React.Component {

  constructor() {
    super()
    this.state = {
      showPage: false,
      qrCodeUrl: 'https://static.iqycamp.com/images/serverQrCode.jpg?imageslim'
    }
  }

  componentWillMount() {
    const { scene } = this.props.location.query
    const { dispatch } = this.props
    if(scene) {
      dispatch(startLoad())
      pget(`/subscribe/qrCode?scene=${scene}`).then(res => {
        dispatch(endLoad())
        if(res.code === 200) {
          this.setState({
            qrCodeUrl: res.msg.replace('\\n', ''),
            showPage: true
          })
        } else {
          dispatch(alertMsg(res.msg))
        }
      }).catch(er => dispatch(alertMsg(er)))
    } else {
      this.setState({ showPage: true })
    }
  }

  render() {
    const { showPage, qrCodeUrl } = this.state

    if(showPage) {
      return (
        <div className="subscribe-container">
          <div className="tips">请先关注 “圈外同学”</div>
          <img className="qrcode" src={qrCodeUrl} alt="qrcode"/>
        </div>
      )
    } else {
      return <div/>
    }
  }

}