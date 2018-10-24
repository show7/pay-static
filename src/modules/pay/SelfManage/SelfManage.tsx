import * as React from 'react'
import './SelfManage.less'
import { connect } from 'react-redux'
import { mark } from '../../../utils/request'
import { joinAudioCourse, loadActivityCheck, loadPoster } from '../async'
import { alertMsg } from '../../../redux/actions'
import { closeWindow, configShare } from '../../helpers/JsConfig'

@connect(state => state)
export default class SelfManage extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      isSubscribe: false,
      qrCodeUrl: '',
      saleImg: null,
      subscribe: false
    }
  }

  componentWillMount() {
    this.getInfo()
    configShare(
      `【圈外同学】请停止无效努力音频课`,
      `https://${window.location.hostname}/pay/selfmanage?riseId=${window.ENV.riseId}`,
      'https://static.iqycamp.com/71527579350_-ze3vlyrx.pic_hd.jpg',
      `顶尖咨询总监，8年职场方法论`
    )
  }

  getInfo() {
    const { riseId = null } = this.props.location.query
    let param = riseId ? Object.assign({}, { riseId: riseId }) : {}
    loadActivityCheck(param).then((res) => {
      if(res.code === 200) {
        let result = res.msg
        this.setState({
          isSubscribe: result.isSubscribe,
          qrCodeUrl: result.qrCodeUrl,
          saleImg: result.saleImg
        })
        if(!result.isSubscribe) {
          this.setState({
            subscribe: true
          })
        }
      }
    })
  }

  handleFree(){
    mark({module:"打点",function:"音频课课程",action:"点击免费入学"})
    joinAudioCourse()
    closeWindow()
  }

  render() {
    const {
      qrCodeUrl,
      saleImg,
      subscribe
    } = this.state
    return (
      <div className='self-manage-container'>
        {
          saleImg && saleImg.map((item, index) => {
            return <img key={index} src={item} alt=""/>
          })
        }
        <div className="bottom-button">
          <ul>
            <li onClick={()=>this.handleFree()}>免费入学</li>
          </ul>
        </div>
        {
          subscribe && qrCodeUrl &&
          <div className="subscribe-mask">
            <div className="qrCodeUrl-box">
              <p>你还没有关注公众号，请先扫码关注哦！</p>
              <img className='subscribe' src={qrCodeUrl} alt=""/>
              <img className='close'
                   onClick={() => {this.setState({ subscribe: false })}}
                   src="https://static.iqycamp.com/close-2-t6urec58.png" alt=""/>
            </div>
          </div>
        }
      </div>
    )
  }
}
