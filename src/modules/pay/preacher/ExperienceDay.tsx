import * as React from 'react'
import './ExperienceDay.less'
import { connect } from 'react-redux'
import { set, startLoad, endLoad, alertMsg } from 'redux/actions'
import { mark } from 'utils/request'

@connect(state => state)
export default class ExperienceDay extends React.Component<any, any> {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor() {
    super()
    this.state = {}
    this.pd = 50 / 750 * window.innerWidth
    this.topPd = 90 / 500 * window.innerWidth
  }

  componentWillMount() {
    mark({ module: '打点', function: '体验日', action: '进入体验日页面' })
  }

  render() {
    const { preacherNumber = '' } = this.state

    return (
      <div className="experience-day-page">
        <div className="gutter" style={{ height: `${this.topPd}px` }}/>
        <div className="success-header">预约成功</div>
        <div className="success-tips">
          <div>体验一：教学理念和服务</div>
          <div>体验二：一节免费体验课</div>
          <div>体验三：商学院面试指南</div>
        </div>
        <div className="step-wrapper">
          <div className="content">
            <div className="step step-1" data-step="1" style={{ paddingBottom: `${this.pd}px` }}>
              扫码添加圈外小V
              <div style={{fontSize:'11px',marginTop:'5px'}}>工作日2小时内回复，请耐心等待</div>
              <img src="https://static.iqycamp.com/images/fragment/qrcode_xiaov_20180403.jpeg?imageslim" alt="小V"
                   className="qrcode"/>
            </div>

            <div className="step step-3" data-step="2">
              通过后<br/>
              回复"商学院"开始体验！
            </div>
          </div>
        </div>
      </div>
    )
  }
}
