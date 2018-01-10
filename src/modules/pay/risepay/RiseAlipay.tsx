import * as React from 'react'
import './RisePay.less'
import { connect } from 'react-redux'
import { SaleBody } from './components/SaleBody'
import { set, startLoad, endLoad, alertMsg } from 'redux/actions'
import { configShare } from '../../helpers/JsConfig'
import { Dialog } from 'react-weui'
import { MarkBlock } from '../components/markblock/MarkBlock'
import { mark } from 'utils/request'
import { addUserRecommendation } from './async'

@connect(state => state)
export default class RiseAlipay extends React.Component<any, any> {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor() {
    super()
    this.state = {
      subscribe: true,
      show: false
    }
  }
  render(){
    return (
      <div className="rise-alipay">
        {JSON.stringify(window.ENV)}
      </div>
    )
  }
}
