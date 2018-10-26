import * as React from 'react'
import './SelfManage.less'
import { connect } from 'react-redux'
import { mark } from '../../../utils/request'
import { joinAudioCourse, loadActivityCheck, loadFriendInfo, loadPoster, loadTask } from '../async'
import { alertMsg } from '../../../redux/actions'
import { configShare } from '../../helpers/JsConfig'

@connect(state => state)
export default class SelfManage extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      status: 0,
      url: '',
      saleImg: null,
      showShare: false,//不显示分享
      showShareImg: false,
      showFriend: false,
      friendName:''
    }
  }

  componentWillMount() {
    const { channelAudioMessage = '1', riseId } = this.props.location.query
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
    const { riseId = null, type = 0, taskId } = this.props.location.query
    let param = riseId ? Object.assign({}, { riseId: riseId }) : {}

    loadActivityCheck(param).then((res) => {
      if(res.code === 200) {
        let result = res.msg
        this.setState({
          saleImg: result.saleImg
        })
      }
    })
    this.loadTask(taskId)
    if(type == 1) {
      this.setState({ showShare: true })
    } else if(type == 2 && riseId !== window.ENV.riseId) {
      loadFriendInfo(riseId).then(res=>{
        if(res.code === 200) {
          this.setState({
            friendName:res.msg,
            showFriend: true })
        }
      })
    }
  }

  /*获取值贡献*/
  loadTask(taskId) {
    loadTask(taskId).then((res) => {
      if(res.code === 200) {
        this.setState({ task: res.msg }, () => {
          configShare(
            `【圈外同学】6天破除职场迷茫`,
            `https://${window.location.hostname}/pay/selfmanage?riseId=${window.ENV.riseId}&type=2`,
            `https://static.iqycamp.com/71527579350_-ze3vlyrx.pic_hd.jpg`,
            `${window.ENV.userName}邀请你成为同学，免费体验课程`)
        })
      }
    })
  }

  handleFree() {
    const { dispatch } = this.props
    const {riseId} = this.props.location.query
    mark({ module: '打点', function: '音频课课程', action: '点击免费入学' })
    joinAudioCourse(riseId).then(res => {
      if(res.code === 200) {
        this.setState({
          status: res.msg.status,
          url: res.msg.url,
          showShareImg: false
        })
      } else {
        dispatch(alertMsg(res.msg))
      }
    })
  }

  /*投资圈外分享好友*/
  getsShowShare() {
    configShare(
      `【圈外同学】6天破除职场迷茫`,
      `https://${window.location.hostname}/pay/selfmanage?riseId=${window.ENV.riseId}&type=2`,
      `https://static.iqycamp.com/71527579350_-ze3vlyrx.pic_hd.jpg`,
      `${window.ENV.userName}邀请你成为同学，免费体验课程`)
    mark({ module: '打点', function: '关闭弹框l2', action: '点击关闭弹框' })
    this.setState({ showShare: false, showShareImg: true })
  }

  hideFriend() {
    this.setState({ showFriend: false })
  }

  render() {
    const { type } = this.props.location.query
    const {
      saleImg,
      status,
      url,
      showShare, task = {}, showShareImg, showFriend,friendName
    } = this.state
    console.log(task)
    const { shareContribution } = task

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

        {
          showShare &&
          <div className="share-mask-box">
            <dev className="share-content">
              <div className="share-content-top">
                <p>邀请好友免费体验</p>
              </div>
              <div className="share-content-bottom">
                <div><span>1</span><p className='desc'>好友成功入学，你将获得{shareContribution}贡献值</p></div>
                <div className="button-bottom" onClick={() => {
                  this.getsShowShare()
                }}><p>立即邀请</p></div>
              </div>
            </dev>
          </div>
        }
        {
          showFriend &&
          <div className="share-mask-box">
            <dev className="share-content">
              <div className="share-content-top">
                <p>好友邀请</p>
              </div>
              <div className="share-content-bottom">
                <div><p className='desc'>{friendName}邀请你成为TA的同学，免费体验圈外商学院职场课。</p></div>
                <div className="button-bottom" onClick={() => {
                  this.hideFriend()
                }}><p>确定</p></div>
              </div>
            </dev>
          </div>
        }

        {
          showShareImg && type == 1 &&
          <div className="type-share">
            <img src="https://static.iqycamp.com/1091533182527_-sc42kog6.pic.jpg" alt="分享图片"/>
          </div>
        }

      </div>
    )
  }
}
