import * as React from 'react'
import './PreacherPage.less'
import { connect } from 'react-redux'
import { set, startLoad, endLoad, alertMsg } from 'redux/actions'
import { Button, ButtonArea } from 'react-weui'
import Icon from '../../../components/Icon'
import { SubmitButton } from '../../../components/submitbutton/SubmitButton'
import { loadPreacherNumber } from './async';
import { mark } from '../../../utils/request'

@connect(state => state)
export default class PreacherPage extends React.Component<any, any> {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor() {
    super()
    this.state = {}
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(startLoad());
    loadPreacherNumber().then(res => {
      dispatch(endLoad());
      if(res.code === 200) {
        this.setState({ preacherNumber: res.msg });
      } else {
        dispatch(alertMsg(res.msg));
      }
    }).catch(ex => {
      dispatch(endLoad());
      dispatch(alertMsg(ex));
    })
  }

  handleClickGoApply() {
    mark({ module: '打点', function: '宣讲课页面', action: '申请商学院' })
    window.location.href = `https://${window.location.hostname}/rise/static/business/apply/start`
  }

  render() {
    const { preacherNumber = "" } = this.state

    return (
      <div className="preacher-page">
        <div className="top-banner">
        </div>
        <div className="preacher-description white-bg">
          世界的运行其实是有规律的，正如地球绕着太阳转一样，人生中碰到的很多问题也是有规律的，不管是爱情、情绪、人际还是工作。
          当你每知道一种规律，你就获得了一次升级，你收获的不仅仅是物质上的回报，更重要的是让你眼前的世界变得清晰。
          当你开始学会并开始实现这些规律和套路的时候，你的世界会从标清标清模式突然变成高清模式。
        </div>
        <div className="video-partition white-bg">
          <video src="http://139.224.134.53/preacher_video_1.mp4" className="preacher-video" controls={true}/>
          <div className="preacher-video-title">1. 模糊不确定的VUCA时代，你需要看得更清楚</div>
          <div className="preacher-video-tips">
            #宣讲会/ 5'27''
          </div>
          <div className="preacher-video-description">
            VUCA时代，人工智能即将代替510万个工作岗位。面对未来结构性调整，你该如何比别人看得更清楚一些？
          </div>
        </div>

        <div className="video-partition white-bg">
          <video src="http://139.224.134.53/preacher_video_2.mp4" className="preacher-video" controls={true}/>
          <div className="preacher-video-title">2. 终身学习：活到老=学到老吗？</div>
          <div className="preacher-video-tips">
            #宣讲会/ 21'34''
          </div>
          <div className="preacher-video-description">
            在大时代背景下，什么是终身学习？未来会长什么样子？知识大爆炸、习惯死记硬背，如何掌握职场稀缺能力，助力未来职业发展？
          </div>
        </div>

        <div className="video-partition white-bg">
          <video src="http://139.224.134.53/preacher_video_3.mp4" className="preacher-video" controls={true}/>
          <div className="preacher-video-title">3. 借助他人的力量</div>
          <div className="preacher-video-tips">
            #宣讲会/ 16'02''
          </div>
          <div className="preacher-video-description">
            如何借助他人力量，链接精英大咖？扩展视野、结识全球行业精英、对标企业高管、和中欧长江竞技，你也能成为他人眼中职场神话！
          </div>
        </div>

        <div className="video-partition white-bg">
          <video src="http://139.224.134.53/preacher_video_4.mp4" className="preacher-video" controls={true}/>
          <div className="preacher-video-title">4. 我们的商学院有何不同 —— 你负责努力，我们帮你赢</div>
          <div className="preacher-video-tips">
            #宣讲会/ 10'12''
          </div>
          <div className="preacher-video-description">
            专业课程委员会，专属定制学习，优秀学员更享奖学金和资源对接。沙盘模拟、案例创投，用有趣玩法和激励体制帮你赢。
          </div>
        </div>

        <div className="recently-tips white-bg">
          最新一期宣讲会信息，请扫码加小助手<br/>
          并回复数字{preacherNumber}
        </div>
        <div className="img-wrapper white-bg">
          <img src="https://static.iqycamp.com/images/qrcode_xiaoy_20171117.jpeg?imageslim"
               className="qrcode"/>
        </div>
        <div style={{ height: '60px' }}/>
        <SubmitButton clickFunc={() => this.handleClickGoApply()} buttonText="申请商学院"/>
      </div>
    )
  }
}
