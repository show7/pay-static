import * as React from 'react'
import './RisePay.less'
import { connect } from 'react-redux'
import { mark } from '../../../utils/request'
import { SaleBody } from './components/SaleBody'
import { chooseAuditionCourse } from '../async'
import { set, startLoad, endLoad, alertMsg } from 'redux/actions'
import { configShare } from '../../helpers/JsConfig'
import { Dialog } from "react-weui"
const { Alert } = Dialog

@connect(state => state)
export default class RiseApply extends React.Component<any, any> {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor() {
    super()
    this.state = {
      subscribe: true,
      show:false,
    }
  }

  componentWillMount() {
    mark({ module: '打点', function: '商学院guest', action: '购买商学院会员' })
  }

  componentDidMount() {
    configShare(`圈外商学院--你负责努力，我们负责帮你赢`,
      `https://${window.location.hostname}/pay/static/rise`,
      'https://static.iqycamp.com/images/rise_share.jpg?imageslim',
      '最实用的竞争力提升课程，搭建最优质的人脉圈，解决最困扰的职场难题')
  }

  redirect() {
    mark({ module: '打点', function: '商学院guest', action: '申请商学院' }).then(res => {
      window.location.href = `https://${window.location.hostname}/rise/static/business/apply/start`
      // window.location.href = 'https://www.iquanwai.com/survey/wjx?activity=18057279'
    })
  }

  handleClickAudition() {
    // 开试听课
    const { dispatch } = this.props
    dispatch(startLoad())
    chooseAuditionCourse().then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
        const { goSuccess, errMsg, subscribe } = res.msg
        if(errMsg) {
          dispatch(alertMsg(errMsg))
        } else {
          if(!subscribe) {
            this.setState({ show:true })
          } else {
            if(goSuccess) {
              this.context.router.push({
                pathname: '/pay/audition/success'
              })
            } else {
              dispatch(alertMsg('您已预约过，上课请关注公众号后，进入商学院'))
            }
          }
        }
      } else {
        dispatch(alertMsg(res.msg))
      }
    }).catch(ex => {
      dispatch(endLoad())
      dispatch(alertMsg(ex))
    })
  }

  render() {
    const { show } = this.state
    const renderPay = () => {
      return (
        <div className="pay-page">
          <SaleBody />
          <div className="button-footer">
            <div className="footer-left" onClick={() => this.handleClickAudition()}><span
              className="audition">{'预约试听'}</span></div>
            <div className="footer-btn" onClick={() => this.redirect()}>申请商学院</div>
          </div>

        </div>
      )
    }

    return (
      <div className="rise-pay-container" onClick={()=>this.setState({show:false})}>
        <Alert show={show} title="扫码关注，完成预约">
            <img src="https://www.iqycamp.com/images/qrcode/audition_signup.jpeg" style={{width: 160, height: 160}}/>
        </Alert>

        {renderPay()}
      </div>
    )
  }
}
