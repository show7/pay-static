import * as React from 'react'
import { GoodsType } from '../../../utils/helpers'
import { queryOrderSuccess } from './async'
import { alertMsg } from '../../../redux/actions'

export default class AlipayReturn extends React.Component<any, any> {

  constructor() {
    super()
    this.state = {}
  }

  componentWillMount() {
    if(!!window.ENV.Detected.browser.name && window.ENV.Detected.browser.name === '微信') {
      // 微信里
      let orderId = _.get(location, 'query.orderId');
      if(!!orderId) {
        let orderInterval = setInterval(() => {
          queryOrderSuccess(_.get(location, 'query.orderId')).then(res => {
            if(res.code === 200) {
              clearInterval(orderInterval);
              const { goodsId, goodsType } = res.msg;
              if(goodsType == GoodsType.FRAG_MEMBER || goodsType == GoodsType.FRAG_CAMP) {
                window.location.href = `/pay/member/success?goodsId=${goodsId}`
              } else if(goodsType == GoodsType.BS_APPLICATION) {
                window.location.href = `/pay/applysubmit?goodsId=${goodsId}`
              }
            }
          }).catch(ex => {
            dispatch(alertMsg(ex));
          })
        }, 7000);
      }
    }
  }

  componentDidMount() {
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
