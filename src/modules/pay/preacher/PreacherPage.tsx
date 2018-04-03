import * as React from 'react'
import './PreacherPage.less'
import { connect } from 'react-redux'
import { set, startLoad, endLoad, alertMsg } from 'redux/actions'
import { SubmitButton } from '../../../components/submitbutton/SubmitButton'
import { loadPreacherNumber } from './async'
import { mark } from 'utils/request'
import { MarkBlock } from '../components/markblock/MarkBlock'

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
    mark({ module: '打点', function: '宣讲课页面', action: '进入宣讲课页面' })
    const { dispatch } = this.props
    // dispatch(startLoad())
    // loadPreacherNumber().then(res => {
    //   dispatch(endLoad())
    //   if(res.code === 200) {
    //     this.setState({ preacherNumber: res.msg })
    //   } else {
    //     dispatch(alertMsg(res.msg))
    //   }
    // }).catch(ex => {
    //   dispatch(endLoad())
    //   dispatch(alertMsg(ex))
    // })
  }

  handleClickGoApply() {
    this.context.router.push({
      pathname: '/pay/bsstart'
    })
  }

  render() {
    const { preacherNumber = '' } = this.state

    return (
      <div className="preacher-page">
        {/*<div className="top-banner">*/}
        {/*</div>*/}
        {/*<div className="preacher-description white-bg">*/}
        {/*这世界的运行是有规律的。<br/><br/>*/}

        {/*正如地球绕着太阳转一样，你在人生中碰到的很多问题，也都是有规律的，比如爱情、比如情绪、比如人际。<br/>*/}
        {/*每知道一种规律，你就获得了一次升级。而升级之后的回报，不仅仅是物质收入方面，更重要的是，它让你眼前的世界变得更加清晰。<br/><br/>*/}

        {/*圈外商学院每个月都会举办宣讲会，我们会请各个领域的大咖直播给大家分享关于未来、学习、商业的思考，以及圈外商学院会如何通过课程、校友会等资源帮大家提升自己的认知和价值。<br/><br/>*/}
        {/*<ul style={{ marginLeft: '1rem' }}>*/}
        {/*<li>*/}
        {/*宣讲会讲什么？<br/>*/}

        {/*11月29日宣讲会的主题是：《VUCA时代，你需要看的更清楚》，在这次分享会里，商学院的校长圈圈教给我们两个在VUCA时代立于不败之地的制胜绝招。 以下是视频回放。<br/><br/>*/}
        {/*</li>*/}
        {/*<li>*/}
        {/*如何预约下期宣讲会？<br/>*/}
        {/*每次的宣讲会都是可以提前预约的，如果你不想错过每次的精彩。扫描底部二维码添加小助手，并回复数字即可。*/}
        {/*</li>*/}
        {/*</ul>*/}


        {/*</div>*/}
        {/*<div className="video-partition white-bg">*/}
        {/*<video src="https://static.iqycamp.com/video/preacher_video_1.mp4" className="preacher-video" controls={true}*/}
        {/*poster='https://static.iqycamp.com/images/stage1_poster.jpeg?imageslim'/>*/}
        {/*<div className="preacher-video-title">1. 模糊不确定的VUCA时代，你需要看得更清楚</div>*/}
        {/*<div className="preacher-video-tips">*/}
        {/*5'27''*/}
        {/*</div>*/}
        {/*<div className="preacher-video-description">*/}
        {/*宝洁首席运营官Robert McDonald借用一个军事术语来描述我们身处的这个充满变化、不确定的、复杂和模糊的时代 ：“这是一个VUCA的世界”。<br/>*/}
        {/*越是时代处于混沌状态的时候，越是需要我们保持视野和头脑的清醒。根据达沃斯世界经济论坛介绍，2020年之际全球将会有510万个工作岗位消失。面对未来职场结构性调整，圈圈告诉你 ——*/}
        {/*VUCA时代的核心就是，你要比别人看得更清楚一些。<br/>*/}
        {/*</div>*/}
        {/*</div>*/}

        {/*<div className="video-partition white-bg">*/}
        {/*<video src="https://static.iqycamp.com/video/preacher_video_2.mp4" className="preacher-video" controls={true}*/}
        {/*poster='https://static.iqycamp.com/images/stage2_poster.jpeg?imageslim'/>*/}
        {/*<div className="preacher-video-title">2. 终身学习＝活到老学到老？</div>*/}
        {/*<div className="preacher-video-tips">*/}
        {/*21'34''*/}
        {/*</div>*/}
        {/*<div className="preacher-video-description">*/}
        {/*人人都在谈论终身学习，究竟什么是终身学习？是什么原因导致我们的学习方式发生了变化？未来发展到底要求我们具备什么样的能力？调研显示，我们又到底缺乏了哪些能力？圈圈告诉你，VUCA时代，怎么学、学什么才不浪费。*/}
        {/*</div>*/}
        {/*</div>*/}

        {/*<div className="video-partition white-bg">*/}
        {/*<video src="https://static.iqycamp.com/video/preacher_video_3.mp4" className="preacher-video" controls={true}*/}
        {/*poster='https://static.iqycamp.com/images/stage3_poster.jpeg?imageslim'/>*/}
        {/*<div className="preacher-video-title">3. 借助他人的力量</div>*/}
        {/*<div className="preacher-video-tips">*/}
        {/*16'02''*/}
        {/*</div>*/}
        {/*<div className="preacher-video-description">*/}
        {/*大家有没有听过一句话，你的水平是你自己周围朋友的平均水平，这句话其实是有道理的，我们很容易受到我们周围朋友和同事的影响。<br/>*/}
        {/*作为圈外读者和学员，你想不想知道自己和优秀职场人相比，到底有何不同？这些人在一起，能做哪些不一样的事儿？圈圈告诉教你如何链接顶尖MBA校友、投资人和高端人脉资源，借助他人的力量提升自己。*/}
        {/*</div>*/}
        {/*</div>*/}

        {/*<div className="video-partition white-bg">*/}
        {/*<video src="https://static.iqycamp.com/video/preacher_video_4.mp4" className="preacher-video" controls={true}*/}
        {/*poster='https://static.iqycamp.com/images/stage4_poster.jpeg?imageslim'/>*/}
        {/*<div className="preacher-video-title">4. 我们的商学院有何不同 —— 你负责努力，我们帮你赢</div>*/}
        {/*<div className="preacher-video-tips">*/}
        {/*10'12''*/}
        {/*</div>*/}
        {/*<div className="preacher-video-description">*/}
        {/*课程委员会、校友会、职业发展中心到底是做什么的？学习为什么变得不再那么枯燥和难坚持了？圈外学员凭什么能去企业给员工讲课？学习明明是为了我自己，为什么还有奖学金和奖品可以拿？想知道你能不能通过商学院电话申请考核，圈圈开办的商学院究竟有何不同，快来听圈圈揭晓答案。*/}
        {/*</div>*/}
        {/*</div>*/}

        <div className="recently-tips">
          你是否正在好奇圈外同学课表上的内容？<br/>
          你是否希望先体验学习方式再报名加入？<br/>
          你是否渴望链接一群有趣又优秀的伙伴？<br/><br/>

          你若是好奇，就来亲自体验一下吧！<br/><br/>

          这是一所特别的在线商学院——<br/>
          特别1：体系化课程，全面提升个人能力<br/>
          特别2：70%超高完课率，100个人学习，70个都能完成的烧脑练习<br/>
          特别3：每天都有学员感叹，“要是早点遇见圈外就好了！“<br/><br/>

          现在你有一个机会去体验它的特别，去看看在广受世界500强企业、商学院教授和投资人好评的新型商学院中学习，是怎样一种新奇的体验。<br/>

          体验内容：<br/>
          1、了解商学院教学理念和服务 – 我们提供并不苦逼的刻意练习<br/>
          2、获取免费体验课 – 一节不对外开放的商学院课程<br/>
          3、圈外商学院面试指南 – 申请流程早知道，提高录取率<br/><br/>

          如果你也想体验这一切，就赶紧添加“圈外小V”，回复“<b style={{ color: '#FFB200' }}>商学院</b>”吧。<br/>
          {/*商学院不定期组织精彩的体验活动<br/>预约名额有限<br/>请扫下方二维码<br/>回复“<b style={{color:'#FFB200'}}>商学院</b>”预约*/}
          <div className="img-wrapper">
            <img src="https://static.iqycamp.com/images/fragment/qrcode_xiaov_20180403.jpeg?imageslim"
                 className="qrcode"/>
          </div>
        </div>
        {/*<div style={{ height: '64px' }}/>*/}
        <MarkBlock module={'打点'} func={'宣讲课页面'} action={'申请商学院'}>
          <SubmitButton clickFunc={() => this.handleClickGoApply()} buttonText="申请商学院"/>
        </MarkBlock>
      </div>
    )
  }
}
