import * as React from 'react'
import './RisePay.less'
import { connect } from 'react-redux'
import PicLoading from './components/PicLoading'

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

  redirect() {
    window.location.href = 'https://www.iquanwai.com/survey/wjx?activity=16666777'
  }

  render() {
    const { loading } = this.state

    const renderPay = () => {
      return (
        <div className="pay-page">
          <div className="sale-pic">
            <img src="https://static.iqycamp.com/images/rise_promotion_5.png?imageslim"
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