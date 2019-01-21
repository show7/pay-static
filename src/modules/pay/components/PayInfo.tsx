///<reference path="../../../utils/helpers.ts"/>
import * as React from 'react'
import './PayInfo.less'
import Icon from '../../../components/Icon'
import * as _ from 'lodash'
import classnames from 'classnames';

const numeral = require('numeral')
import { startLoad, endLoad, alertMsg } from 'redux/actions'
import {
  afterPayDone, logPay, loadGoodsInfo, loadPaymentParam, calculateCoupons
} from '../async'
import { mark } from 'utils/request'

import { pay } from '../../helpers/JsConfig'
import { getQueryString, GoodsType, PayType, saTrack } from '../../../utils/helpers'

/** 超过这个金额时可以选择支付方式 */
const MULTI_PAY_TYPE_PRICE = 100;
/** 在这个金额范围内的可以选择银联支付 */
const KFQ_PAY_PRICE_RANGE = [ 600, 50000 ];

interface PayInfoProps {
  /** 显示支付窗口的回调 */
  afterShow?: any,
  /** 关闭支付窗口的回调 */
  afterClose?: any,
  /** 获得商品信息后的回调 */
  gotGoods?: any,
  /** 触发支付的回调 */
  payedBefore?: any,
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
  /** 是否可以使用多个优惠券 */
  mutilCoupon?: boolean,
  /** 价格提示 */
  priceTips?: string,
  /** 支付类型 */
  payType?: number,
}

export default class PayInfo extends React.Component<PayInfoProps, any> {
  constructor(props) {
    super(props)
    this.state = {
      coupons: [],
      fee: this.props.fee,
      show: false,
      openPayType: false,
      chose: {
        used: false,
        total: 0,
        couponsIdGroup: [],
      },
      payType: this.props.payType || PayType.WECHAT
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

    let payMethod = getQueryString(window.location.href, 'pay');
    // 获取商品数据
    if(!goodsId || !goodsType) {
      return
    }
    this.setState({
      justOpenPayType: goodsId == 7 && GoodsType.BS_APPLICATION == goodsType,
      showKfq: !!payMethod,
      showHuabei: !!payMethod
    })
    loadGoodsInfo(goodsType, goodsId).then(res => {
      if(res.code === 200) {
        this.setState(res.msg, () => {
          // 如果autoChose有值则自动选择优惠券
          if(!_.isEmpty(res.msg.autoCoupons) && res.msg.coupons) {
            this.handleAutoChooseCoupon(res.msg.autoCoupons, res.msg.multiCoupons, goodsType, goodsId);
          }
        })
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

  componentDidMount() {
    document.querySelector('.coupon-list').addEventListener('scroll', function(e) {
      let _this = this;
      if(_this.scrollTop >= _this.scrollHeight - _this.clientHeight - 1) {
        _this.scrollTop = _this.scrollHeight - _this.clientHeight - 1;
      } else if(_this.scrollTop <= 1) {
        _this.scrollTop = 1;
      }
    })
  }

  handleClickOpen() {
    const { fee } = this.state;
    // 价格小于100 则直接付费
    if(fee <= MULTI_PAY_TYPE_PRICE) {
      if(_.isFunction(this.props.afterShow)) {
        this.props.afterShow()
      }
      this.handleClickPay();
    } else {
      this.setState({ show: true }, () => {
        if(_.isFunction(this.props.afterShow)) {
          this.props.afterShow()
        }
        saTrack('clickPayDialogButton', {
          goodsType: this.props.goodsType,
          goodsId: Number(this.props.goodsId).toString()
        })
      })
    }

  }

  handleClickClose() {
    this.setState({
      show: false, openCoupon: false
    }, () => {
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
    const { dispatch, goodsType, goodsId, activityId = null, channel = null } = this.props
    const { chose, final, free, multiCoupons, payType = PayType.WECHAT } = this.state
    if(!goodsId || !goodsType) {
      dispatch(alertMsg('支付信息错误，请联系管理员'))
    }
    let param = { goodsId: goodsId, goodsType: goodsType, payType: payType }
    if(chose) {
      if(!_.isEmpty(chose.couponsIdGroup)) {
        param = _.merge({}, param, { couponsIdGroup: chose.couponsIdGroup })
      }
    }
    if(activityId) {  //活动id
      param = _.merge({}, param, { activityId: activityId })
    }
    if(channel) {
      param = _.merge({}, param, { channel: channel })
    }
    dispatch(startLoad())
    loadPaymentParam(param).then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
        saTrack('clickPayButton', {
          goodsType: this.props.goodsType,
          goodsId: Number(this.props.goodsId).toString(),
          payType: payType
        })
        if(_.isFunction(this.props.payedBefore)) {
          this.props.payedBefore();
        }
        const { fee, free, signParams, productId } = res.msg
        this.setState({ productId: productId })
        if(!_.isNumber(fee)) {
          dispatch(alertMsg('支付金额异常，请联系工作人员'))
          return
        }
        if(free && numeral(fee).format('0.00') === '0.00') {
          // 免费
          this.handlePayDone();
        } else {
          if(payType == PayType.WECHAT) {
            // 收费，调微信支付
            this.handleH5Pay(signParams)
            // 暂时跳转到新连接
            // window.location.href = signParams.weChatBrowserUrl;
          } else if(payType == PayType.ALIPAY) {
            // 调用阿里支付
            window.location.href = `/pay/alipay/rise?orderId=${productId}&goto=${encodeURIComponent(signParams.alipayUrl)}&type=hb`;
            // console.log(signParams.alipayUrl);
          } else if(payType == PayType.KFQ) {
            window.location.href = signParams.kfqUrl;
          } else {
            // 花呗分期
            window.location.href = `/pay/alipay/rise?orderId=${productId}&goto=${encodeURIComponent(signParams.huabeiUrl)}&type=hb`;
          }
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
      dispatch(alertMsg('Windows的微信客户端不能支付哦，请在手机端购买课程～'))
    }
    // 调起H5支付
    // console.log('start pay');
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

  handleAutoChooseCoupon(autoCoupons, multiCoupons, goodsType, goodsId) {
    if(_.isEmpty(autoCoupons)) {
      return;
    }
    const { dispatch } = this.props
    // 可用的优惠券
    let chose = {
      couponsIdGroup: [],
      total: 0,
      used: false,
    }
    let param = { goodsId: goodsId, goodsType: goodsType }

    chose.used = true;
    for(let i = 0; i < autoCoupons.length; i++) {
      chose.couponsIdGroup.push(autoCoupons[ i ].id);
      chose.total += autoCoupons[ i ].amount;
    }
    _.merge(param, { couponsIdGroup: chose.couponsIdGroup });
    calculateCoupons(param).then((res) => {
      dispatch(endLoad())
      if(res.code === 200) {
        let state = { free: res.msg === 0, chose: chose, final: res.msg };
        if(!multiCoupons) {
          _.merge(state, { openCoupon: false });
        }
        this.setState(state)
      } else {
        dispatch(alertMsg(res.msg))
      }
    }).catch(ex => {
      dispatch(endLoad())
      dispatch(alertMsg(ex))
    })

  }

  /**
   * 选择优惠券
   * @param coupon 优惠券
   */
  handleClickChooseCoupon(coupon) {
    const { dispatch, goodsId, goodsType } = this.props
    const { multiCoupons } = this.state;
    let coupons = _.get(this.state, 'coupons', [])
    // coupons = this.filterCoupons(coupons, goodsType)
    let chose = _.get(this.state, 'chose', {});
    dispatch(startLoad())
    let param = { goodsId: goodsId, goodsType: goodsType }
    // 可以选择多个优惠券
    if(chose === null) {
      chose = {
        couponsIdGroup: []
      }
    } else {
      if(!chose.couponsIdGroup) {
        chose.couponsIdGroup = [];
      }
    }
    if(_.indexOf(chose.couponsIdGroup, coupon.id) !== -1) {
      // 取消选择
      chose.couponsIdGroup = _.remove(chose.couponsIdGroup, (item) => item != coupon.id);
    } else {
      if(!multiCoupons) {
        chose.couponsIdGroup = []
      }
      chose.couponsIdGroup.push(coupon.id);
    }
    _.merge(param, { couponsIdGroup: chose.couponsIdGroup });

    if(_.isEmpty(chose.couponsIdGroup)) {
      chose.used = false;
      chose.total = 0;
    } else {
      chose.used = true;
      let total = 0;
      if(!multiCoupons) {
        total = coupon.amount;
      } else {
        for(let i = 0; i < coupons.length; i++) {
          if(_.indexOf(chose.couponsIdGroup, coupons[ i ].id) !== -1) {
            total += coupons[ i ].amount;
          }
        }
      }
      chose.total = total;
    }

    calculateCoupons(param).then((res) => {
      dispatch(endLoad())
      if(res.code === 200) {
        let state = { free: res.msg === 0, chose: chose, final: res.msg };
        if(!multiCoupons) {
          _.merge(state, { openCoupon: false });
        }
        this.setState(state)
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

  handleClickChooseAll() {
    const { dispatch, goodsId, goodsType } = this.props
    let coupons = _.get(this.state, 'coupons', [])
    // coupons = this.filterCoupons(coupons, goodsType)
    const { multiCoupons } = this.state;
    if(multiCoupons && !_.isEmpty(coupons)) {
      let chose = _.get(this.state, 'chose', {});
      // 可以多选
      let addCount = 0;
      if(!chose) {
        chose = {
          total: 0,
          used: false
        };
      }
      let choseList = _.get(chose, 'couponsIdGroup', []);
      if(!choseList) {
        choseList = [];
      }
      for(let i = 0; i < coupons.length; i++) {
        if(_.indexOf(choseList, coupons[ i ].id) === -1) {
          choseList.push(coupons[ i ].id);
          chose.total += coupons[ i ].amount;
          addCount++;
        }
      }

      if(addCount === 0) {
        // 需要反选
        chose.couponsIdGroup = [];
        chose.used = false;
        chose.total = 0;
      } else {
        chose.couponsIdGroup = choseList;
        chose.used = true;
      }

      let param = { goodsId: goodsId, goodsType: goodsType, couponsIdGroup: chose.couponsIdGroup };
      dispatch(startLoad())
      calculateCoupons(param).then((res) => {
        dispatch(endLoad())
        if(res.code === 200) {
          this.setState({ free: res.msg === 0, chose: chose, final: res.msg, chose: chose, chooseAll: addCount !== 0 })
        } else {
          dispatch(alertMsg(res.msg))
        }
      }).catch(ex => {
        dispatch(endLoad())
        dispatch(alertMsg(ex))
      })
    }
  }

  choosePayType(payType) {
    const { openPayType, fee } = this.state;
    // console.log(fee);
    if(fee <= MULTI_PAY_TYPE_PRICE) {
      return;
    }
    console.log('选择paytype', payType);
    if(!!payType) {
      // 有payType
      this.setState({ payType: payType, openPayType: false })
      setTimeout(() => {
        this.setState({ hiddenCoupon: false })
      }, 500)
    } else {
      if(openPayType) {
        // 要关闭
        this.setState({ openPayType: false })
        setTimeout(() => {
          this.setState({ hiddenCoupon: false })
        }, 500)
      } else {
        // 要打开
        this.setState({ openPayType: true, hiddenCoupon: true })
      }
    }
  }

  render() {
    const { openCoupon, final, fee, chose, free, show, name,
      startTime, endTime, activity, multiCoupons, openPayType,
      chooseAll, initPrice, payType, hiddenCoupon = false,
      justOpenPayType, showKfq, showHuabei } = this.state
    const { header, goodsId, goodsType } = this.props
    let coupons = _.get(this.state, 'coupons', [])
    // coupons = this.filterCoupons(coupons, goodsType)
    const hasCoupons = !_.isEmpty(coupons)

    /**
     * 支付icon
     */
    const renderPayIcon = (payType) => {
      switch(payType) {
        case PayType.WECHAT: {
          return 'pay_type_icon_wechat';
        }
        case PayType.ALIPAY: {
          return 'pay_type_icon_ali';
        }
        case PayType.KFQ: {
          return 'pay_type_icon_bank';
        }
        default: {
          return 'pay_type_icon_hb';
        }
      }
    }

    /**
     * 支付方式名字
     */
    const renderPayTypeName = (payType) => {
      switch(payType) {
        case PayType.WECHAT: {
          return '微信支付';
        }
        case PayType.ALIPAY: {
          return '支付宝';
        }
        case PayType.KFQ: {
          return '银联分期';
        }
        case PayType.HUABEI_3: {
          return '花呗分期(3期)'
        }
        case PayType.HUABEI_6: {
          return '花呗分期(6期)'
        }
        case PayType.HUABEI_12: {
          return '花呗分期(12期)'
        }
        default: {
          return ''
        }
      }
    }

    /**
     * 渲染价格
     * @param fee 价格
     * @param final 最终价格（打折后）
     * @param free 是否免费
     * @param initPrice 原价
     * @returns {Array} 展示dom结构
     */
    const renderPrice = (fee, final, free, initPrice) => {
      if(activity) {
        fee = activity.price
      }

      let priceArr = []
      if(initPrice && !_.isEqual(initPrice, fee)) {
        priceArr.push(<span className="discard" key={0}>{`原价：¥${numeral(initPrice).format('0.00')}元`}</span>)
      } else if((final || free) && !_.isEqual(final, fee)) {
        priceArr.push(<span className="discard" key={0}>{`¥ ${numeral(fee).format('0.00')}元`}</span>)
      }

      if(priceArr.length >= 1) {
        priceArr.push(<span className="final" key={1}
                            style={{ marginLeft: '5px' }}>{`¥ ${numeral((final || free) && !_.isEqual(final, fee) ? final : fee).format('0.00')}元`}</span>)
      } else {
        priceArr.push(<span className="final" key={0}>{`¥ ${numeral(fee).format('0.00')}元`}</span>)
      }
      if(this.props.priceTips) {
        priceArr.push(<div key={priceArr.length} className="price-tips">{this.props.priceTips}</div>)
      }
      return priceArr
    }

    const couponChosen = (item) => {
      return _.indexOf(_.get(chose, 'couponsIdGroup'), item.id) !== -1
    }

    // <!-- render内容如下：如果是安卓4.3以下版本的话，则渲染简化页面，否则渲染正常页面 -->
    if(window.ENV.osName === 'android' && parseFloat(window.ENV.osVersion) <= 4.3) {

      // <!-- 安卓4.3 以下 -->
      return (
        <div className={`simple-pay-info ${show ? 'show' : ''}`}>
          <div className="pi-close" onClick={() => this.handleClickClose()}>
            关闭
          </div>
          <div className="main-container">
            <div className="header">
              {header || name}
            </div>
            <div className="content">
              <div className={`price item ${this.props.priceTips ? 'show-tips' : ''}`}>
                {renderPrice(fee, final, free)}
              </div>
              {(!!startTime && !!endTime) && <div className="open-time item">
                开课时间：{startTime} - {endTime}
              </div>}
              <div className={`coupon item`}>
                {coupons && chose && chose.used ? `优惠券：¥${numeral(chose.total).format('0.00')}元` : '选择优惠券'}
              </div>
            </div>
            <ul className={`coupon-list`}>
              {coupons ? coupons.map((item, seq) => {
                return (
                  <li className="coupon" key={seq}>
                    ¥{numeral(item.amount).format('0.00')}元
                    <span className="describe">{item.description ? item.description : ''}</span>
                    <span className="expired">{item.expired}过期</span>
                    <div className={`btn ${couponChosen(item) ? 'chose' : ''}`}
                         onClick={() => this.handleClickChooseCoupon(item)}>
                      选择
                    </div>
                  </li>
                )
              }) : null}
            </ul>
            <span style={{ paddingLeft: '15px', fontSize: '15px', color: '#333' }}>支付方式:</span><br/>
            <ul className="pay-type-list">
              <li className={classnames({ 'choose': payType == PayType.WECHAT })}
                  onClick={() => this.setState({ payType: PayType.WECHAT })}>微信
              </li>
              {fee > MULTI_PAY_TYPE_PRICE &&
              <li className={classnames({ 'choose': payType == PayType.ALIPAY })}
                  onClick={() => this.setState({ payType: PayType.ALIPAY })}>支付宝/*<span className="pay-type-tips">(支持花呗分期)</span>*/
              </li>}
              {(fee >= KFQ_PAY_PRICE_RANGE[ 0 ] && fee <= KFQ_PAY_PRICE_RANGE[ 1 ]) && showKfq &&
              <li className={classnames({ 'choose': payType == PayType.KFQ })}
                  onClick={() => this.setState({ payType: PayType.KFQ })}>银联分期
              </li>}
              {showHuabei && <li className={classnames({ 'choose': payType == PayType.HUABEI_3 })}
                                 onClick={() => this.setState({ payType: PayType.HUABEI_3 })}>花呗分期(3期)
              </li>}
              {showHuabei && <li className={classnames({ 'choose': payType == PayType.HUABEI_6 })}
                                 onClick={() => this.setState({ payType: PayType.HUABEI_6 })}>花呗分期(6期)
              </li>}
              {showHuabei && <li className={classnames({ 'choose': payType == PayType.HUABEI_12 })}
                                 onClick={() => this.setState({ payType: PayType.HUABEI_12 })}>花呗分期(12期)
              </li>}
            </ul>
          </div>
          <div className="btn-container">
            <div className="btn" onClick={() => this.handleClickPay()}/>
          </div>
        </div>
      )
    } else {
      // <!--  非安卓4.3 -->
      return (
        <div className={classnames('pay-info', {
          'show': show, 'hasCoupons': hasCoupons, 'hasTime': !!startTime && !!endTime
        })}>
          {show &&
          <div className={classnames('pi-close', { 'hasCoupons': hasCoupons, 'hasTime': !!startTime && !!endTime })}
               onClick={() => this.handleClickClose()}>
            <Icon type="white_close_btn" size="40px"/>
          </div>}
          <div className={classnames('main-container', {
            'hasCoupons': hasCoupons, 'show': show, 'hasTime': !!startTime && !!endTime
          })}>
            <div className={classnames('header', {
              'openCoupon': openCoupon || openPayType, 'just-open-pay-type': justOpenPayType
            })}>
              {header || name}
            </div>
            <div className={classnames('content', {
              'openCoupon': openCoupon || openPayType, 'just-open-pay-type': justOpenPayType
            })}>
              {(!!startTime && !!endTime) && <div className="open-time item">
                开课时间：<span className="right-float">{startTime} - {endTime}</span>
              </div>}
              <div className={classnames('price', 'item', { 'show-tips': this.props.priceTips })}>
                {renderPrice(fee, final, free, initPrice)}
              </div>
              {hasCoupons &&
              <div className={classnames('has-arrow', 'coupon', 'item', {
                'open': openCoupon, 'hidden': openPayType, 'just-open-pay-type': justOpenPayType
              })} onClick={() => this.setState({ openCoupon: !this.state.openCoupon })}>
                {chose && chose.used ? `优惠券：¥${numeral(chose.total).format('0.00')}元` : `选择优惠券`}
                {(openCoupon && multiCoupons) &&
                <div className="coupon-manual-close">
                  确认
                </div>}
              </div>}

              <div
                className={classnames('pay-type', 'item', {
                  'open': openPayType,
                  'hidden': openCoupon,
                  'just-open-pay-type': justOpenPayType,
                  'has-arrow': fee > MULTI_PAY_TYPE_PRICE
                })}
                onClick={() => this.choosePayType()}>
                支付方式
                {!openPayType &&
                <div className="small-pay-type-info">
                  <div className="pay-icon">
                    <Icon type={renderPayIcon(payType)}/>
                  </div>
                  <div className="pay-type-name">{renderPayTypeName(payType)}</div>
                </div>
                }
              </div>
            </div>
            <ul className={classnames('coupon-list', {
              'open': openCoupon, 'hidden': hiddenCoupon, 'just-open-pay-type': justOpenPayType
            })}>
              {multiCoupons && (
                <div className="choose-all-wrapper">
                  <div className="choose-area">
                    <div className="choose-all-tips">全选</div>
                    <div className={classnames('choose-all', { 'chose': chooseAll })}
                         onClick={() => this.handleClickChooseAll()}>
                      <div className="btn">
                      </div>
                      <div className="mask">
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {coupons && coupons.map((item, seq) => {
                return (
                  <li className="coupon" key={seq}>
                    <div className="coupon-left">
                      <div className="coupon-price">
                        ¥{numeral(item.amount).format('0.00')}元
                      </div>
                      <div className="coupon-desc">
                        <span className="describe">{item.description ? item.description : ''}</span>
                        <span className="expired">{item.expired}过期</span>
                      </div>
                    </div>
                    <div className="shuxian">
                    </div>
                    <div className={classnames('chose-btn', {
                      'multi-chooses': multiCoupons, 'chose': couponChosen(item)
                    })}
                         onClick={() => this.handleClickChooseCoupon(item)}>
                      <div className={classnames('btn', { 'multi-chooses': multiCoupons })}>
                      </div>
                      <div className={classnames('mask', { 'multi-chooses': multiCoupons })}>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>

            <ul className={classnames('pay-list', {
              'open': openPayType, 'hidden': openCoupon, 'just-open-pay-type': justOpenPayType
            })}>
              <li className="pay-type-item">
                <div className="pay-type-info">
                  <div className="pay-icon">
                    <Icon type='pay_type_icon_wechat'/>
                  </div>
                  <div className="pay-type-name">微信支付</div>
                </div>
                <div className={classnames('chose-btn', {
                  'chose': payType == PayType.WECHAT
                })}
                     onClick={() => this.choosePayType(PayType.WECHAT)}>
                  <div className='btn'>
                  </div>
                  <div className='mask'>
                  </div>
                </div>
              </li>

              <li className="pay-type-item">
                <div className="pay-type-info">
                  <div className="pay-icon">
                    <Icon type='pay_type_icon_ali'/>
                  </div>
                  <div className="pay-type-name">支付宝{/*<span className="pay-type-tips">(支持花呗分期)</span>*/}</div>
                </div>
                <div className={classnames('chose-btn', {
                  'chose': payType == PayType.ALIPAY
                })}
                     onClick={() => this.choosePayType(PayType.ALIPAY)}>
                  <div className='btn'>
                  </div>
                  <div className='mask'>
                  </div>
                </div>
              </li>

              {(fee >= KFQ_PAY_PRICE_RANGE[ 0 ] && fee <= KFQ_PAY_PRICE_RANGE[ 1 ]) && showKfq &&
              <li className="pay-type-item">
                <div className="pay-type-info">
                  <div className="pay-icon">
                    <Icon type='pay_type_icon_bank'/>
                  </div>
                  <div className="pay-type-name">银联分期</div>
                </div>
                <div className={classnames('chose-btn', {
                  'chose': payType == PayType.KFQ
                })}
                     onClick={() => this.choosePayType(PayType.KFQ)}>
                  <div className='btn'>
                  </div>
                  <div className='mask'>
                  </div>
                </div>
              </li>}

              {showHuabei && <li className="pay-type-item">
                <div className="pay-type-info">
                  <div className="pay-icon">
                    <Icon type='pay_type_icon_hb'/>
                  </div>
                  <div className="pay-type-name">花呗分期(3期){/*<span className="pay-type-tips">(支持花呗分期)</span>*/}</div>
                </div>
                <div className={classnames('chose-btn', {
                  'chose': payType == PayType.HUABEI_3
                })}
                     onClick={() => this.choosePayType(PayType.HUABEI_3)}>
                  <div className='btn'>
                  </div>
                  <div className='mask'>
                  </div>
                </div>
              </li>}

              {showHuabei && <li className="pay-type-item">
                <div className="pay-type-info">
                  <div className="pay-icon">
                    <Icon type='pay_type_icon_hb'/>
                  </div>
                  <div className="pay-type-name">花呗分期(6期){/*<span className="pay-type-tips">(支持花呗分期)</span>*/}</div>
                </div>
                <div className={classnames('chose-btn', {
                  'chose': payType == PayType.HUABEI_6
                })}
                     onClick={() => this.choosePayType(PayType.HUABEI_6)}>
                  <div className='btn'>
                  </div>
                  <div className='mask'>
                  </div>
                </div>
              </li>}

              {showHuabei && <li className="pay-type-item">
                <div className="pay-type-info">
                  <div className="pay-icon">
                    <Icon type='pay_type_icon_hb'/>
                  </div>
                  <div className="pay-type-name">花呗分期(12期){/*<span className="pay-type-tips">(支持花呗分期)</span>*/}</div>
                </div>
                <div className={classnames('chose-btn', {
                  'chose': payType == PayType.HUABEI_12
                })}
                     onClick={() => this.choosePayType(PayType.HUABEI_12)}>
                  <div className='btn'>
                  </div>
                  <div className='mask'>
                  </div>
                </div>
              </li>}

            </ul>
          </div>
          <div className={classnames('btn-container', { 'openCoupon': openCoupon || openPayType })}>
            <div className="btn" onClick={() => this.handleClickPay()}>
              确认支付
            </div>
          </div>
          {show && <div className="mask"/>}
        </div>)
    }
  }
}
