import * as React from 'react'
import './QYVideo.less'
import {
  randomStr
} from '../../utils/helpers'

export default class QYVideo extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.player = null // 腾讯视频player
    this.playerId = randomStr(12) // player id
  }

  componentDidMount() {
    const { fileId } = this.props
    if(fileId) {
      // 初始化腾讯播放器
      console.log(TCPlayer);
      this.player = new TCPlayer(`fileId${this.playerId}`, { // player-container-id 为播放器容器ID，必须与html中一致
        fileID: fileId, // 请传入需要播放的视频fileID 必须
        appID: '1256115011', // 请传入点播账号的appID 必须
        playsinline: true, // 行内播放模式
        plugins: {

          /*
           * auto: true, //[可选] 是否在视频播放后自动续播
           * text:'上次播放至 ', //[可选] 提示文案
           * btnText: '恢复播放' //[可选] 按钮文案
           */
          // 开启续播功能
          ContinuePlay: {}
        }
      })
      this.player.on('pause', () => {
        if(this.props.getStatious) {
          this.props.getStatious(true)
        }
      })
      this.player.on('playing', () => {
        if(this.props.getStatious) {
          this.props.getStatious(false)
        }
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.mediaPlay) {
      if(this.props.mediaPlay == 'false' && nextProps.mediaPlay == 'true') {
        nextProps.fileId ? this.player.play() : this.refs.video.play()
      }
    }
    if(nextProps.mediaPause) {
      if(this.props.mediaPause == 'false' && nextProps.mediaPause == 'true') {
        nextProps.fileId ? this.player.pause() : this.refs.video.pause()
      }
    }
  }

  componentWillUnmount() {
    const { fileId } = this.props
    if(fileId) {
      this.player.off('pause')
      this.player.off('playing')
    }
  }

  render() {
    const {
      videoUrl, videoPoster, fileId
    } = this.props

    return (
      <div className="video-container">
        {
          fileId ? (
            <video ref="video"
                   id={`fileId${this.playerId}`}
                   preload="auto"
                   poster={videoPoster}/>
          ) : (
            <video ref="video"
                   src={videoUrl}
                   poster={videoPoster}
                   controls="controls"
                   width="100%"
                   playsinline
                   onPause={() => {
                     this.props.getStatious ? this.props.getStatious(true) : ''
                   }}
                   onPlaying={() => {
                     this.props.getStatious ? this.props.getStatious(false) : ''
                   }}
                   webkit-playinline
                   x5-playinline/>
          )}
      </div>
    )
  }
}

