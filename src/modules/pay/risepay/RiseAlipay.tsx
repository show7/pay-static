import * as React from 'react'
import './RisePay.less'
import { connect } from 'react-redux'
import { set, startLoad, endLoad, alertMsg } from 'redux/actions'
import * as _ from 'lodash';
import AssetImg from '../../../components/AssetImg'
import { queryOrderSuccess } from './async'
import { GoodsType } from '../../../utils/helpers'
import { mark } from '../../../utils/request'

@connect(state => state)
export default class RiseAlipay extends React.Component<any, any> {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor() {
    super()
    this.state = {}
  }

  componentDidMount() {
    const { dispatch, location } = this.props;
    dispatch(startLoad());
    let interval = setInterval(() => {
      if(!!window.ENV.Detected.browser.name) {
        dispatch(endLoad());
        clearInterval(interval);
        if(window.ENV.Detected.browser.name === '微信') {
          this.setState({
            isWechat: true,
            imageUrl: window.ENV.osName === 'ios' ? 'https://www.iqycamp.com/images/fragment/bg_go_ali_ios1.png'
              : 'https://www.iqycamp.com/images/fragment/bg_go_ali_android.png'
          }, () => {
            let orderInterval = setInterval(() => {
              queryOrderSuccess(_.get(location, 'query.orderId')).then(res => {
                if(res.code === 200) {
                  clearInterval(orderInterval);
                  const { goodsId, goodsType } = res.msg;
                  if(goodsType == GoodsType.FRAG_MEMBER) {
                    mark({ module: '打点', function: '商学院会员', action: '支付成功' })
                    this.context.router.push({
                      pathname: '/pay/member/success',
                      query: {
                        memberTypeId: 3
                      }
                    })
                  } else if(goodsType == GoodsType.BS_APPLICATION) {
                    this.context.router.push('/pay/applysubmit');
                  } else if(goodsType == GoodsType.FRAG_CAMP) {
                    mark({ module: '打点', function: '小课训练营', action: '支付成功', memo: this.state.currentCampMonth })
                    this.context.router.push({
                      pathname: '/pay/camp/success',
                      query: {
                        memberTypeId: 5
                      }
                    })
                  }
                }
              }).catch(ex => {
                dispatch(alertMsg(ex));
              })
            }, 7000);
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
          <AssetImg url={imageUrl} width="100%"/>
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
