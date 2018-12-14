import * as React from 'react'
import { GoodsType } from '../../../utils/helpers'
import { queryOrderSuccess } from './async'
import { alertMsg, endLoad } from '../../../redux/actions'
import * as _ from 'lodash';

export default class AlipayReturn extends React.Component<any, any> {

  constructor() {
    super()
    this.state = {}
  }

  componentWillMount() {

  }

  componentDidMount() {
    const { dispatch, location } = this.props;
    let interval = setInterval(() => {
      if(!!window.ENV.Detected.browser.name) {
        clearInterval(interval);
        if(window.ENV.Detected.browser.name === '微信') {
          // 微信里
          let orderId = _.get(location, 'query.orderId');
          if(!!orderId) {
            let orderInterval = setInterval(() => {
              queryOrderSuccess(orderId).then(res => {
                if(res.code === 200) {
                  clearInterval(orderInterval);
                  const { goodsId, goodsType } = res.msg;
                  // if(goodsType == GoodsType.FRAG_MEMBER || goodsType == GoodsType.FRAG_CAMP || goodsType == GoodsType.COMBAT) {
                  if(goodsType == GoodsType.BS_APPLICATION) {
                    window.location.href = `/pay/applysubmit?goodsId=${goodsId}`
                  } else {
                    window.location.href = `/pay/member/success?goodsId=${goodsId}`
                  }
                }
              }).catch(ex => {
                console.error(ex);
              })
            }, 7000);
          }
        }
      }
    }, 100)
  }

  render() {

    return (
      <div style={{
        fontSize: '20px',
        color: '#333',
        textAlign: 'center',
        marginTop: '40px'
      }}>
        您已支付成功，请返回微信查看
      </div>
    )
  }
}
