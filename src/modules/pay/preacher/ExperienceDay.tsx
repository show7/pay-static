import * as React from 'react'
import './ExperienceDay.less'
import { connect } from 'react-redux'
import { set, startLoad, endLoad, alertMsg } from 'redux/actions'
import { SubmitButton } from '../../../components/submitbutton/SubmitButton'
import { loadPreacherNumber } from './async'
import { mark } from 'utils/request'
import { MarkBlock } from '../components/markblock/MarkBlock'

@connect(state => state)
export default class ExperienceDay extends React.Component<any, any> {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor() {
    super()
    this.state = {}
  }

  componentWillMount() {
    mark({ module: '打点', function: '宣讲课页面', action: '进入体验日页面' })
  }

  handleClickGoApply() {
    this.context.router.push({
      pathname: '/pay/bsstart'
    })
  }

  render() {
    const { preacherNumber = '' } = this.state

    return (
      <div className="experience-day-page">
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
          <div className="img-wrapper">
            <img src="https://static.iqycamp.com/images/fragment/qrcode_xiaov_20180403.jpeg?imageslim"
                 className="qrcode"/>
          </div>
        </div>
        <MarkBlock module={'打点'} func={'体验日页面'} action={'申请商学院'}>
          <SubmitButton clickFunc={() => this.handleClickGoApply()} buttonText="申请商学院"/>
        </MarkBlock>
      </div>
    )
  }
}
