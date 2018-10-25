import * as React from 'react'
import './SelfManage.less'
import { connect } from 'react-redux'
import { mark } from '../../../utils/request'
import { joinAudioCourse, loadActivityCheck, loadPoster } from '../async'
import { alertMsg } from '../../../redux/actions'
import { configShare } from '../../helpers/JsConfig'

@connect(state => state)
export default class SelfManage extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      status: 0,
      url: '',
      saleImg: null
    }
  }

  componentWillMount() {
    const { channelAudioMessage = '1' } = this.props.location.query
    mark({ module: '打点', function: '音频课课程', action: '进入售卖页', channelAudioMessage: channelAudioMessage })
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
          saleImg: result.saleImg
        })
      }
    })
  }

  handleFree() {
    const { dispatch } = this.props
    mark({ module: '打点', function: '音频课课程', action: '点击免费入学' })
    joinAudioCourse().then(res => {
      if(res.code === 200) {
        this.setState({
          status: res.msg.status,
          url: res.msg.url
        })
      } else {
        dispatch(alertMsg(res.msg))
      }
    })

  }

  render() {
    const {
      saleImg,
      status,
      url
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
            <li onClick={() => this.handleFree()}>免费入学</li>
          </ul>
        </div>
        {
          url &&
          <div className="subscribe-mask">
            <div className="qrCodeUrl-box">
              <p>{status === 0 ? '你已入学，扫二维码添加班主任👇' : '扫二维码添加班主任，免费开课👇'}</p>
              <img className='subscribe' src={url} alt=""/>
              <img className='close'
                   onClick={() => {this.setState({ url: false })}}
                   src="https://static.iqycamp.com/close-2-t6urec58.png" alt=""/>
            </div>
          </div>
        }
      </div>
    )
  }
}
