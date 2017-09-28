import * as React from 'react'
import './RisePay.less'
import { connect } from 'react-redux'
import PicLoading from './components/PicLoading'
import { mark } from '../../utils/request'
import { mevent } from '../../utils/mark'

const numeral = require('numeral')

@connect(state => state)
export default class RiseApply extends React.Component<any, any> {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor() {
    super()
    this.state = {
      loading: true,
    }
  }

  componentWillMount(){
    mark({ module: '打点', function: '商学院guest', action: '购买商学院会员' })
  }

  redirect() {
    mevent('商学院guest', '申请商学院')
    mark({ module: '打点', function: '商学院guest', action: '申请商学院' }).then(res=>{
      window.location.href = 'https://www.iquanwai.com/survey/wjx?activity=16666777'
    })
  }

  render() {
    const { loading } = this.state

    const renderPay = () => {
      return (
        <div className="pay-page">
          <div className="sale-pic">
            <img src="https://static.iqycamp.com/images/rise_promotion_6.png?imageslim"
                 style={{ width: '100%' }}
                 onLoad={() => this.setState({ loading: false })}/>
          </div>
          <div className="button-footer" onClick={() => this.redirect()}>
            <div className="footer-btn">申请商学院</div>
          </div>

        </div>
      )
    }

    return (
      <div className="rise-pay-container">
        <PicLoading show={loading}/>
        {renderPay()}
      </div>
    )
  }
}
