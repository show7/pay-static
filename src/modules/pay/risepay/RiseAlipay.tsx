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

    }
  }

  componentDidMount() {
    const { dispatch, location } = this.props;
    dispatch(startLoad());
    let interval = setInterval(() => {
      console.log(window.ENV.Detected.browser.name);
      if(!!window.ENV.Detected.browser.name) {
        dispatch(endLoad());
        clearInterval(interval);
        if(window.ENV.Detected.browser.name === '微信') {
          this.setState({
            isWechat: true,
            imageUrl: window.ENV.osName === 'ios' ? 'https://www.iqycamp.com/images/fragment/bg_go_ali_ios1.png'
              : 'https://www.iqycamp.com/images/fragment/bg_go_ali_android.png'
          })
        } else {
          window.location.href = _.get(location, 'query.goto');
        }
      }
    }, 100);
    this.setState({ interval: interval });
  }

  render() {
    const { isWechat, imageUrl } = this.state;
    if(isWechat) {
      return (
        <div style={{ padding: '4rem' }}>
          <img src={imageUrl} style={{
            width: '100%',
            height: 'auto',
            display: 'block'
          }}/>
        </div>
      )
    } else {
      return (
        <div>
          跳转中......
        </div>
      )
    }
  }
}
