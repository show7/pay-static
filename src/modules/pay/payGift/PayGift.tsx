import * as React from 'react'
import './PayGift.less'
import {SubmitButton} from '../../../components/submitbutton/SubmitButton'
import numeral from 'numeral'
import {loadGoodsInfo, loadPaymentParam, logPay} from '../async'
import {mark} from '../../../utils/request'
import _ from 'lodash'
import {
  GoodsType,
  PayType,
  saTrack,
  refreshForPay,
  getQueryString,
} from '../../../utils/helpers'
import {alertMsg} from 'redux/actions'
import {configShare, pay} from '../../helpers/JsConfig'
import {connect} from 'react-redux'
@connect(state => state)
export default class PayGift extends React.Component<any, any> {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      showPayFlay: false,
      choseFlay: false,
      wayList: [
        {id: PayType.WECHAT, name: '微信'},
        {id: PayType.ALIPAY, name: '支付宝'},
      ],
      chosedWayId: 1, //选取的支付方式的id,1微信支付，2支付宝支付
      unitPrice: 1, //单价
      totalNum: 1, //购买个数
      projectName: '', //购买课程名称
      showShare: false,
    }
  }

  componentWillMount() {
    if (refreshForPay()) {
      return
    }
    this.loadGoodsInfo()
  }

  /**
   * 选取的支付方式id
   * @param id
   */
  handleGetWay(id) {
    this.setState({chosedWayId: id, choseFlay: false})
  }

  /**
   * 增减购买个数
   * @param flag
   */
  handleAddReduce(flag) {
    if (flag == 1) {
      if (this.state.totalNum === 1) return
      this.setState({totalNum: this.state.totalNum - 1})
    } else {
      this.setState({totalNum: this.state.totalNum + 1})
    }
  }

  /**
   *  获取课程单价信息
   */
  loadGoodsInfo() {
    const {goodsId, goodsType, paId} = this.props.location.query

    loadGoodsInfo(goodsType, goodsId, paId).then(res => {
      if (res.code === 200) {
        this.setState({
          totalNum: 1,
          unitPrice: res.msg.fee,
          projectName: res.msg.name,
          sellImgs: res.msg.sellImgs,
          memberTypeId: res.msg.memberTypeId,
        })
      }
    })
  }

  /**
   * 点击支付
   */
  handleClickPay() {
    const {goodsId, goodsType, paId} = this.props.location.query

    const {chosedWayId, totalNum} = this.state
    let param = {
      goodsId: goodsId,
      goodsType: goodsType,
      sum: totalNum,
      payType: chosedWayId,
      priceActivityId: paId,
    }
    loadPaymentParam(param).then(res => {
      if (res.code === 200) {
        const {fee, free, signParams, productId} = res.msg
        if (!_.isNumber(fee)) {
          alert('支付金额异常，请联系工作人员')
          return
        }
        chosedWayId === PayType.WECHAT
          ? this.weChatPay(signParams, goodsType)
          : (window.location.href = `/pay/alipay/rise?orderId=${productId}&goto=${encodeURIComponent(
              signParams.alipayUrl
            )}`)
      }
    })
  }

  /**
   * 微信支付
   * @param signParams
   * @param goodsType
   */
  weChatPay(signParams, goodsType) {
    let functionName = goodsType || '未知商品'
    mark({
      module: '支付',
      function: functionName,
      action: '开始支付',
      memo: 'url:' + window.location.href + ',os:' + window.ENV.systemInfo,
    })
    const {dispatch} = this.props
    if (window.ENV.osName === 'windows') {
      // windows客户端
      mark({
        module: '支付',
        function: functionName,
        action: 'windows-pay',
        memo: 'url:' + window.location.href + ',os:' + window.ENV.systemInfo,
      })
      dispatch(alertMsg('Windows的微信客户端不能支付哦，请在手机端购买课程～'))
      return
    }
    pay(
      {
        appId: signParams.appId, //公众号名称，由商户传入
        timeStamp: signParams.timeStamp, //时间戳，自1970年以来的秒数
        nonceStr: signParams.nonceStr, //随机串
        package: signParams.package,
        signType: signParams.signType, //微信签名方式：
        paySign: signParams.paySign, //微信签名
      },
      () => {
        // 购买成功的回调
        mark({
          module: '支付',
          function: functionName,
          action: 'success',
          memo: 'url:' + window.location.href + ',os:' + window.ENV.systemInfo,
        })
        this.handlePayDone()
      },
      res => {
        // 用户点击取消的回调
        mark({
          module: '支付',
          function: functionName,
          action: 'cancel',
          memo: 'url:' + window.location.href + ',os:' + window.ENV.systemInfo,
        })
        this.handleClickClose()
      },
      res => {
        // 支付失败的回调
        logPay(
          functionName,
          'error',
          'os:' +
            window.ENV.systemInfo +
            ',error:' +
            (_.isObjectLike(res) ? JSON.stringify(res) : res) +
            ',configUrl:' +
            window.ENV.configUrl +
            ',url:' +
            window.location.href
        )
        this.handleClickError()
      }
    )
  }
  /**
   *
   * 支付成功回调
   */
  handlePayDone() {
    window.location.href = `https://${
      window.location.hostname
    }/rise/activity/static/promotion/shareposter?memberTypeId=17`
  }
  /**
   * 支付关闭回调
   */
  handleClickClose() {
    const {dispatch} = this.props
    this.setState({showPayFlay: false, choseFlay: false})
    dispatch(alertMsg('支付已取消'))
  }
  /**
   * 支付err
   */
  handleClickError() {
    const {dispatch} = this.props
    this.setState({showPayFlay: false, choseFlay: false})
    dispatch(alertMsg('支付失败'))
  }
  render() {
    const {
      showPayFlay,
      choseFlay,
      wayList,
      chosedWayId,
      totalNum,
      unitPrice,
      projectName,
      showShare,
      sellImgs,
    } = this.state
    return (
      <div className="pay-gift">
        {sellImgs &&
          sellImgs.map((item, index) => (
            <img key={index} src={item} alt="售卖页" />
          ))}
        {/*------------  购买弹框button  ------------*/}
        <SubmitButton
          buttonText="购买体验卡"
          clickFunc={() => {
            this.setState({showPayFlay: true})
            mark({
              module: '打点',
              function: '专项课赠送',
              action: '购买专项课赠送',
              memo: '专项课赠送',
            })
          }}
        />
        {showPayFlay && <div className="pay-mask" />}
        <div className={`pay-layout ${showPayFlay ? 'active' : ''}`}>
          <p className="close">
            <img
              onClick={() => {
                this.setState({showPayFlay: false, choseFlay: false})
              }}
              src="https://static.iqycamp.com/close-2-t6urec58.png"
              alt="关闭"
            />
          </p>
          <div className="layout-content">
            <p className="name">{projectName}</p>
            <div className="unit-content">
              <p>
                单价：
                <span className="unit-price">
                  ¥ {numeral(unitPrice).format('0.00')}
                </span>
              </p>
              <div className="add-num">
                <span className="num-name">数量</span>
                <img
                  onClick={() => {
                    this.handleAddReduce(1)
                  }}
                  src="https://static.iqycamp.com/reduce-dpacxarb.png"
                  alt="减"
                />
                <span className="num">{totalNum}</span>
                <img
                  onClick={() => {
                    this.handleAddReduce(2)
                  }}
                  src="https://static.iqycamp.com/plus-7m31qh5b.png"
                  alt="加"
                />
              </div>
              <div className="total-price">
                <p>总金额：¥{numeral(unitPrice * totalNum).format('0.00')}</p>
              </div>
              <div className="pay-way">
                <span>支付方式</span>
                <div
                  className="chose-way"
                  onClick={() => {
                    this.setState({choseFlay: true})
                  }}
                >
                  {chosedWayId == PayType.WECHAT ? (
                    <img
                      src="https://static.iqycamp.com/pay_type_icon_wechat-tk3zx9gt.png"
                      alt="微信"
                    />
                  ) : (
                    <img
                      src="https://static.iqycamp.com/pay_type_icon_ali-yvkeubk4.png"
                      alt="支付宝"
                    />
                  )}
                  <span>
                    {chosedWayId == PayType.WECHAT ? '微信支付' : '支付宝支付'}
                  </span>
                  <img
                    className="down"
                    src="https://static.iqycamp.com/down-s0t7kgwa.png"
                    alt="选择"
                  />
                </div>
              </div>
              <div className="button-pay">
                <p
                  onClick={() => {
                    this.handleClickPay()
                  }}
                >
                  确认支付
                </p>
              </div>
            </div>
          </div>
        </div>
        {/*------------  选择购买方式list  ------------*/}
        <div className={`chose-payway ${choseFlay ? 'active' : ''}`}>
          <ul>
            {wayList.map((item, index) => {
              return (
                <li
                  className={`${chosedWayId == item.id ? 'active' : ''}`}
                  key={item.id}
                  onClick={() => {
                    this.handleGetWay(item.id)
                  }}
                >
                  {item.name}
                </li>
              )
            })}
          </ul>
        </div>
        {/*------------  分享说明  ------------*/}
        {showShare && (
          <div
            className="share-mask"
            onClick={() => this.setState({showShare: false})}
          >
            <div className="share-mask-box">
              <p>
                你已经成功购买礼品卡，点击右上角，转发给好友进行赠送吧！
                未赠送的礼品卡将会放在“个人中心”-“我的赠卡”
              </p>
            </div>
          </div>
        )}
      </div>
    )
  }
}
