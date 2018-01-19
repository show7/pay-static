import * as React from 'react'
import './RisePay.less'
import { set, startLoad, endLoad, alertMsg } from 'redux/actions'
import { mark } from '../../../utils/request'

export default class AlipayReturn extends React.Component<any, any> {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor() {
    super()
    this.state = {
    }
  }

  componentWillMount() {
    mark({ module: '打点', function: '支付宝', action: '支付成功页面' })
  }

  componentDidMount() {
  }


  render() {

    return (
      <div style={{
        fontSize:'20px',
        color:'#333',
        textAlign:'center',
        marginTop:'40px'
      }}>
        您已支付成功，请返回微信查看
      </div>
    )
  }
}
