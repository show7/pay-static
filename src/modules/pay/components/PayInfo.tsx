import * as React from 'react'
import './PayInfo.less'
import Icon from '../../../components/Icon'
import * as _ from 'lodash'
const numeral = require('numeral')
import { startLoad, endLoad, alertMsg } from 'redux/actions'
import {
  afterPayDone, logPay, mark, loadGoodsInfo, loadPaymentParam, calculateCoupons
} from '../async'

import { pay } from '../../helpers/JsConfig'
import { CouponCategory, GoodsType } from '../../../utils/helpers'

interface CouponProps {
  description?: string,
  expired: string,
  id: number
}

interface PayInfoProps {
  /** 显示支付窗口的回调 */
  afterShow?: any,
  /** 关闭支付窗口的回调 */
  afterClose?: any,
  /** 获得商品信息后的回调 */
  gotGoods?: any,
  /** 支付成功的回调 */
  payedDone?: any,
  /** 支付取消的回调 */
  payedCancel?: any,
  /** 支付失败的回调 */
  payedError?: any,
  /** 商品id */
  goodsId: number,
  /** 产品类型 */
  goodsType: string,
  /** dispatch */
  dispatch: any,
}

export default class PayInfo extends React.Component<PayInfoProps, any> {
  constructor(props) {
    super(props)
    this.state = {
      coupons: [],
      fee: this.props.fee,
      show: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.goodsId !== this.props.goodsId || nextProps.goodsType !== this.props.goodsType) {
      this.componentWillMount(nextProps.goodsType, nextProps.goodsId)
    }
  }

  componentWillMount(type, id) {
    let goodsType = type || this.props.goodsType
    let goodsId = id || this.props.goodsId
    const { dispatch } = this.props

    // 获取商品数据
    if(!goodsId || !goodsType) {
      return
    }
    loadGoodsInfo(goodsType, goodsId).then(res => {
      if(res.code === 200) {
        this.setState(res.msg)
        if(_.isFunction(this.props.gotGoods)) {
          this.props.gotGoods(res.msg)
        }
      } else {
        dispatch(alertMsg(res.msg))
      }
    }).catch(ex => {
      const { dispatch } = this.props
      dispatch(alertMsg(ex))
    })
  }

  handleClickOpen() {
    this.setState({ show: true }, () => {
      if(_.isFunction(this.props.afterShow)) {
        this.props.afterShow()
      }
    })
  }

  handleClickClose() {
    this.setState({ show: false, openCoupon: false, chose: null, free: false, final: null }, () => {
      if(_.isFunction(this.props.afterClose)) {
        this.props.afterClose()
      }
    })
  }

  /**
   * 点击立即支付
   */
  handleClickPay() {
    // this.props.pay()
    const { dispatch, goodsType, goodsId } = this.props
    const { chose, final, free } = this.state
    if(!goodsId || !goodsType) {
      dispatch(alertMsg('支付信息错误，请联系管理员'))
    }
    let param = { goodsId: goodsId, goodsType: goodsType }
    if(chose) {
      param = _.merge({}, param, { couponId: chose.id })
    }
    dispatch(startLoad())
    loadPaymentParam(param).then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
        const { fee, free, signParams, productId } = res.msg
        this.setState({ productId: productId })
        if(!_.isNumber(fee)) {
          dispatch(alertMsg('支付金额异常，请联系工作人员'))
          return
        }
        if(free && numeral(fee).format('0.00') === '0.00') {
          // 免费
          this.handlePayDone()
        } else {
          // 收费，调微信支付
          this.handleH5Pay(signParams)
        }
      } else {
        dispatch(alertMsg(res.msg))
      }
    }).catch(err => {
      dispatch(endLoad())
      dispatch(alertMsg(err))
    })
  }

  /**
   * 调起H5支付
   * @param signParams
   */
  handleH5Pay(signParams) {
    let functionName = this.props.goodsType || '未知商品'
    mark({
      module: '支付',
      function: functionName,
      action: '开始支付',
      memo: 'url:' + window.location.href + ',os:' + window.ENV.systemInfo
    })

    const { dispatch } = this.props
    if(!signParams) {
      mark({
        module: '支付',
        function: functionName,
        action: '没有支付参数',
        memo: 'url:' + window.location.href + ',os:' + window.ENV.systemInfo
      })
      dispatch(alertMsg('支付信息错误，请刷新'))
      return
    }

    if(this.state.err) {
      mark({
        module: '支付',
        function: functionName,
        action: '支付异常,禁止支付',
        memo: 'error:' + this.state.err + ',' + 'url:' + window.location.href + ',os:' + window.ENV.systemInfo
      })
      dispatch(alertMsg(this.state.err))
      return
    }

    this.setState({ showPayInfo: false })

    if(window.ENV.osName === 'windows') {
      // windows客户端
      mark({
        module: '支付',
        function: functionName,
        action: 'windows-pay',
        memo: 'url:' + window.location.href + ',os:' + window.ENV.systemInfo
      })
      dispatch(alertMsg('Windows的微信客户端不能支付哦，请在手机端购买小课～'))
    }
    // 调起H5支付
    pay({
        'appId': signParams.appId,     //公众号名称，由商户传入
        'timeStamp': signParams.timeStamp,         //时间戳，自1970年以来的秒数
        'nonceStr': signParams.nonceStr, //随机串
        'package': signParams.package,
        'signType': signParams.signType,         //微信签名方式：
        'paySign': signParams.paySign //微信签名
      },
      () => {
        // 购买成功的回调
        mark({
          module: '支付',
          function: functionName,
          action: 'success',
          memo: 'url:' + window.location.href + ',os:' + window.ENV.systemInfo
        })
        this.handlePayDone()
      },
      (res) => {
        // 用户点击取消的回调
        mark({
          module: '支付',
          function: functionName,
          action: 'cancel',
          memo: 'url:' + window.location.href + ',os:' + window.ENV.systemInfo
        })
        this.handleClickClose()
        if(_.isFunction(this.props.payedCancel)) {
          this.props.payedCancel(res)
        }
      },
      (res) => {
        // 支付失败的回调
        logPay(functionName, 'error', 'os:' + window.ENV.systemInfo + ',error:' + (_.isObjectLike(res) ? JSON.stringify(res) : res) + ',configUrl:' + window.ENV.configUrl + ',url:' + window.location.href)
        this.handleClickClose()
        if(_.isFunction(this.props.payedError)) {
          this.props.payedError(res)
        }
      }
    )

  }

  /**
   * 选择优惠券
   * @param coupon 优惠券
   */
  handleClickChooseCoupon(coupon) {
    const { dispatch, goodsId, goodsType } = this.props
    dispatch(startLoad())
    let param = { goodsId: goodsId, goodsType: goodsType, couponId: coupon.id }

    calculateCoupons(param).then((res) => {
      dispatch(endLoad())
      if(res.code === 200) {
        this.setState({ free: res.msg === 0, chose: coupon, final: res.msg, openCoupon: false })
      } else {
        dispatch(alertMsg(res.msg))
      }
    }).catch(ex => {
      dispatch(endLoad())
      dispatch(alertMsg(ex))
    })
  }

  /**
   * 支付完成
   */
  handlePayDone() {
    this.handleClickClose()
    const { dispatch } = this.props
    const { productId } = this.state
    if(this.state.err) {
      mark({
        module: '打点',
        function: '支付',
        action: '支付异常',
        memo: window.location.href
      })
      dispatch(alertMsg('支付失败：' + this.state.err))
      return
    }
    dispatch(startLoad())
    afterPayDone(productId).then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
        if(_.isFunction(this.props.payedDone)) {
          this.props.payedDone(this.props.goodsId)
        }
      } else {
        dispatch(alertMsg(res.msg))
        if(_.isFunction(this.props.payedError)) {
          this.props.payedError(res.msg)
        }
      }
    }).catch((err) => {
      dispatch(endLoad())
      dispatch(alertMsg(err))
      if(_.isFunction(this.props.payedError)) {
        this.props.payedError(res.msg)
      }
    })
  }

  /**
   * 过滤优惠券信息
   */
  filterCoupons(coupons, goodsType) {
    switch(goodsType) {
      case GoodsType.FRAG_MEMBER: {
        return coupons
      }
      default: {
        coupons = coupons.filter((coupon) => {
          return !coupon.category
        })
        return coupons
      }
    }
  }

  render() {
    const { openCoupon, final, fee, chose, free, show, name, startTime, endTime, activity } = this.state
    const { header, goodsId, goodsType } = this.props
    let coupons = _.get(this.state, 'coupons', [])
    coupons = this.filterCoupons(coupons, goodsType)
    const hasCoupons = !_.isEmpty(coupons)
    /* 高度，用于遮盖优惠券 */
    const height = (hasCoupons ? 276 : 226) + 'px'
    /**
     * 计算弹窗偏移量，使用transform增加动画流畅度，浏览器前缀不可省略
     * @param show 是否显示弹窗
     * @param height
     * @returns {{height:string,transform:string}}
     */
    const renderTrans = (show, height) => {
      let style = {}
      height = show ? '100%' : height
      let transY = show ? 0 : height

      _.merge(style, {
        height: `${height}`,
        WebkitTransform: `translateY(${transY})`,
        MozTransform: `translateY(${transY})`,
        msTransform: `translateY(${transY})`,
        OTransform: `translateY(${transY})`,
        transform: `translateY(${transY})`
      })
      return style
    }

    /**
     * 渲染价格
     * @param fee 价格
     * @param final 最终价格（打折后）
     * @param free 是否免费
     * @returns {Array} 展示dom结构
     */
    const renderPrice = (fee, final, free) => {
      if(activity) {
        fee = activity.price
      }

      let priceArr = []
      if(final || free) {
        priceArr.push(<span className="discard" key={0}>{`¥${numeral(fee).format('0.00')}元`}</span>)
        priceArr.push(<span className="final" key={1}
                            style={{ marginLeft: '5px' }}>{`¥${numeral(final).format('0.00')}元`}</span>)
      } else {
        priceArr.push(<span className="final" key={0}>{`¥${numeral(fee).format('0.00')}元`}</span>)
      }
      return priceArr
    }

    /**
     * 计算支付弹窗Header的位移量
     * @param open
     * @returns {{transform: string}}
     */
    const renderHeaderTrans = (open) => {
      let transY = open ? '-142px' : 0
      return {
        WebkitTransform: `translateY(${transY})`,
        MozTransform: `translateY(${transY})`,
        msTransform: `translateY(${transY})`,
        OTransform: `translateY(${transY})`,
        transform: `translateY(${transY})`
      }
    }

    /**
     * 计算底部按钮的位移量，目的是遮盖优惠券列表，使用transform可以优化动画性能
     * @param open
     * @returns {{transform: string}}
     */
    const renderBtnTrans = (open) => {
      let transY = open ? '72px' : 0
      return {
        WebkitTransform: `translateY(${transY})`,
        MozTransform: `translateY(${transY})`,
        msTransform: `translateY(${transY})`,
        OTransform: `translateY(${transY})`,
        transform: `translateY(${transY})`
      }
    }

    // <!-- render内容如下：如果是安卓4.3以下版本的话，则渲染简化页面，否则渲染正常页面 -->
    if(window.ENV.osName === 'android' && parseFloat(window.ENV.osVersion) <= 4.3) {

      // <!-- 安卓4.3 以下 -->
      return (
        <div className="simple-pay-info">
          <div className="close" onClick={() => this.handleClickClose()}>
            关闭
          </div>
          <div className="main-container">
            <div className="header">
              {header || name}
            </div>
            <div className="content">
              <div className="price item">
                {renderPrice(fee, final, free)}
              </div>
              {!!startTime && !!endTime ? <div className="open-time item">
                有效时间：{startTime} - {endTime}
              </div> : null}
              <div className={`coupon item`}>
                {coupons && chose ? `'优惠券'：¥${numeral(chose.amount).format('0.00')}元` : '选择优惠券'}
              </div>
            </div>
            <ul className={`coupon-list`}>
              {coupons ? coupons.map((item, seq) => {
                return (
                  <li className="coupon" key={seq}>
                    ¥{numeral(item.amount).format('0.00')}元
                    <span className="describe">{item.description ? item.description : ''}</span>
                    <span className="expired">{item.expired}过期</span>
                    <div className="btn" onClick={() => this.handleClickChooseCoupon(item)}>
                      选择
                    </div>
                  </li>
                )
              }) : null}
            </ul>
          </div>
          <div className="bn-container">
            <div className="btn" onClick={() => this.handleClickPay()}/>
          </div>
        </div>
      )
    } else {
      // <!--  非安卓4.3 -->
      return (<div className="pay-info" style={ renderTrans(show, height)}>
        {show ? <div className="close" onClick={() => this.handleClickClose()}
                     style={{ bottom: `${hasCoupons ? 276 : 226}px` }}>
          <Icon type="white_close_btn" size="40px"/>
        </div> : null}

        <div className="main-container" style={{ height: `${hasCoupons ? 266 : 216}px`, display: show ? '' : 'none' }}>
          <div className="header" style={renderHeaderTrans(openCoupon)}>
            {header || name}
          </div>
          <div className="content" style={renderHeaderTrans(openCoupon)}>
            <div className="price item">
              {renderPrice(fee, final, free)}
            </div>
            {!!startTime && !!endTime ? <div className="open-time item">
              有效时间：{startTime} - {endTime}
            </div> : null}
            {hasCoupons ? <div className={`coupon item ${openCoupon ? 'open' : ''}`}
                               onClick={() => this.setState({ openCoupon: !this.state.openCoupon })}>
              {chose ? `优惠券：¥${numeral(chose.amount).format('0.00')}元` : `选择优惠券`}
            </div> : null}
          </div>
          <ul className={`coupon-list ${openCoupon ? 'open' : ''}`} style={renderHeaderTrans(openCoupon)}>
            {coupons ? coupons.map((item, seq) => {
              return (
                <li className="coupon" key={seq}>
                  ¥{numeral(item.amount).format('0.00')}元
                  <span className="describe">{item.description ? item.description : ''}</span>
                  <span className="expired">{item.expired}过期</span>
                  <div className="btn" onClick={() => this.handleClickChooseCoupon(item)}>
                    选择
                  </div>
                </li>
              )
            }) : null}
          </ul>
        </div>
        <div className="btn-container" style={renderBtnTrans(openCoupon)}>
          <div className="btn" onClick={() => this.handleClickPay()}>
          </div>
        </div>
        {show ? <div className="mask"/> : null}
      </div>)
    }
  }
}
