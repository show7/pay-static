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
import * as _ from 'lodash';

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

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(startLoad());
    let interval = setInterval(() => {
      console.log(window.ENV.Detected.browser.name);
      if(!!window.ENV.Detected.browser.name) {
        dispatch(endLoad());
        clearInterval(interval);
        this.setState({ isWechat: window.ENV.Detected.browser.name === '微信' })
      }
    }, 100);
    this.setState({ interval: interval });
  }

  render() {
    const { isWechat } = this.state;
    const { location } = this.props;
    if(isWechat) {
      return (
        <div className="rise-alipay">
          请在浏览器里打开
        </div>
      )
    } else {
      return (
        <div className="rise-alipay">
          支付链接：{_.get(location, 'query.goto')}
          <br/>
          <a href={_.get(location, 'query.goto')}>
            去支付
          </a>
        </div>
      )
    }
  }
}
