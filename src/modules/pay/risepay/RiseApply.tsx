import * as React from 'react'
import './RisePay.less'
import { connect } from 'react-redux'
import { mark } from '../../../utils/request'
import { mevent } from '../../../utils/mark'
import { SaleBody } from './components/SaleBody'
import { chooseAuditionCourse } from '../async'
import { set, startLoad, endLoad, alertMsg } from 'redux/actions'

const numeral = require('numeral')

@connect(state => state)
export default class RiseApply extends React.Component<any, any> {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor() {
    super()
    this.state = {
      loading: true
    }
  }

  componentWillMount() {
    mark({ module: '打点', function: '商学院guest', action: '购买商学院会员' })
  }

  redirect() {
    mark({ module: '打点', function: '商学院guest', action: '申请商学院' }).then(res => {
      window.location.href = 'https://www.iquanwai.com/survey/wjx?activity=18057279'
    })
  }

  handleClickAudition() {
    // 开试听课
    const { dispatch } = this.props
    dispatch(startLoad())
    chooseAuditionCourse().then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
        const { planId, goSuccess, errMsg } = res.msg
        if(errMsg) {
          dispatch(alertMsg(errMsg))
        } else {
          if(goSuccess) {
            this.context.router.push({
              pathname: '/pay/static/audition/success'
            })
          } else {
            dispatch(alertMsg('预约失败'))
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
    const { loading } = this.state

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
      <div className="rise-pay-container">
        {renderPay()}
      </div>
    )
  }
}
