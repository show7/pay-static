import * as React from 'react'
import {connect} from 'react-redux'
import {set, startLoad, endLoad, alertMsg} from 'redux/actions'
import * as _ from 'lodash'
import AssetImg from '../../../components/AssetImg'
import {queryOrderSuccess} from './async'
import {GoodsType} from '../../../utils/helpers'
import './RiseAlipay.less'

@connect(state => state)
export default class RiseAlipay extends React.Component<any, any> {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  constructor() {
    super()
    this.state = {
      showTipPic: false,
    }
  }

  showTipPic() {
    this.setState({showTipPic: true})
  }

  componentDidMount() {
    const {dispatch, location} = this.props
    dispatch(startLoad())
    let interval = setInterval(() => {
      if (!!window.ENV.Detected.browser.name) {
        dispatch(endLoad())
        clearInterval(interval)
        if (window.ENV.Detected.browser.name === '微信') {
          let state = {}
          if (location.query.type == 'hb') {
            // 花呗
            state = {
              isWechat: true,
              imageUrl: location.query.goto,
              type: 'hb',
            }
          } else {
            // 支付宝
            state = {
              isWechat: true,
              imageUrl:
                window.ENV.osName === 'ios'
                  ? 'https://static.iqycamp.com/images/fragment/bg_go_ali_ios1.png'
                  : 'https://static.iqycamp.com/images/fragment/bg_go_ali_android.png',
              type: 'ali',
            }
          }

          this.setState(state, () => {
            let orderInterval = setInterval(() => {
              queryOrderSuccess(_.get(location, 'query.orderId'))
                .then(res => {
                  if (res.code === 200) {
                    clearInterval(orderInterval)
                    const {goodsId, goodsType} = res.msg
                    if (
                      goodsType == GoodsType.FRAG_MEMBER ||
                      goodsType == GoodsType.FRAG_CAMP
                    ) {
                      window.location.href = `/pay/member/success?goodsId=${goodsId}`
                    } else if (goodsType == GoodsType.BS_APPLICATION) {
                      window.location.href = `/pay/applysubmit?goodsId=${goodsId}`
                    }
                  }
                })
                .catch(ex => {
                  dispatch(alertMsg(ex))
                })
            }, 7000)
          })
        } else {
          if (location.query.type == 'hb') {
            // 花呗 ignore
            this.setState({
              isWechat: false,
              imageUrl: location.query.goto,
              type: 'hb',
            })
          } else {
            // 支付宝
            window.location.href = _.get(location, 'query.goto')
          }
        }
      }
    }, 100)
    this.setState({interval: interval})
  }

  render() {
    const {location} = this.props
    const {isWechat, imageUrl, showTipPic} = this.state
    console.log('state', showTipPic, this.state)
    if (location.query.type == 'hb') {
      // 花呗 https://static.iqycamp.com/hbbg-kjlnkysw.png
      return (
        <div className="page-rise-alipay">
          <div className="qrcode-wrapper">
            <div className="ops-tips">长按保存二维码</div>
            <div className="img-wrapper">
              <AssetImg url={imageUrl} width="100%" />
            </div>
            <div className="ops-tips" onClick={() => this.showTipPic()}>
              <u>操作步骤</u>
            </div>
          </div>
          <div
            className="tips-dialog"
            style={{display: showTipPic ? 'block' : 'none'}}
          >
            <div className="tips-image-wrapper">
              <AssetImg
                url={'https://static.iqycamp.com/hbbg-kjlnkysw.png'}
                width="100%"
              />
            </div>
            <div
              onClick={() => this.setState({showTipPic: false})}
              className="tips-btn"
            >
              确定
            </div>
          </div>
        </div>
      )
    } else {
      // 支付宝
      if (isWechat) {
        return (
          <div style={{padding: '4rem'}}>
            <AssetImg url={imageUrl} width="100%" />
          </div>
        )
      } else {
        return <div>跳转中......</div>
      }
    }
  }
}
