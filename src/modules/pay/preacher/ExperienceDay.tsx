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
          <br/><br/>
          <b
            style={{ fontSize: '24px', display: 'block', textAlign: 'center', color: 'rgb(244,180,63)' }}>圈外商学院开放日申请</b>
          <br/>

          <div className="img-wrapper">
            <img src="https://static.iqycamp.com/images/fragment/qrcode_xiaov_20180403.jpeg?imageslim"
                 className="qrcode"/>
          </div>
          <div style={{textAlign:'center'}}>
            添加“圈外小V”<br/>
            回复“<b style={{ color: '#FFB200' }}>商学院</b>”开始体验吧
          </div>
        </div>
        {/*<MarkBlock module={'打点'} func={'体验日页面'} action={'申请商学院'}>*/}
        {/*<SubmitButton clickFunc={() => this.handleClickGoApply()} buttonText="申请商学院"/>*/}
        {/*</MarkBlock>*/}
      </div>
    )
  }
}
