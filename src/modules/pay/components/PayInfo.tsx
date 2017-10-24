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
  mutilCoupon: boolean,
}

export default class PayInfo extends React.Component<PayInfoProps, any> {
  constructor(props) {
    super(props)
    this.state = {
      coupons: [],
      fee: this.props.fee,
      show: false,
      chose: {
        used: false,
        total: 0,
        couponsIdGroup: [],
        couponId: null
      }
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
        this.setState(res.msg, () => {
          // 如果autoChose有值则自动选择优惠券
          if(res.msg.autoCoupons && res.msg.coupons) {
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
    this.setState({ show: true }, () => {
      if(_.isFunction(this.props.afterShow)) {
        this.props.afterShow()
      }
    })
  }

  handleClickClose() {
    this.setState({
      show: false, openCoupon: false, chose: { used: false, total: 0, couponsIdGroup: [], couponId: null }, free: false,
      final: null, chooseAll: false
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
    const { dispatch, goodsType, goodsId } = this.props
    const { chose, final, free, multiCoupons } = this.state
    if(!goodsId || !goodsType) {
      dispatch(alertMsg('支付信息错误，请联系管理员'))
    }
    let param = { goodsId: goodsId, goodsType: goodsType }
    if(chose) {
      if(multiCoupons && !_.isEmpty(chose.couponsIdGroup)) {
        param = _.merge({}, param, { couponsIdGroup: chose.couponsIdGroup })
      } else if(chose.couponId) {
        param = _.merge({}, param, { couponId: chose.couponId })
      }
    }
    dispatch(startLoad())
    loadPaymentParam(param).then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
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

  handleAutoChooseCoupon(autoCoupons, multiCoupons, goodsType, goodsId) {
    if(_.isEmpty(autoCoupons)) {
      return;
    }
    const { dispatch } = this.props
    // 可用的优惠券
    let chose = {
      couponsIdGroup: [],
      couponId: undefined,
      total: 0,
      used: false,
    }
    let param = { goodsId: goodsId, goodsType: goodsType }

    if(multiCoupons) {
      chose.used = true;
      for(let i = 0; i < autoCoupons.length; i++) {
        chose.couponsIdGroup.push(autoCoupons[ i ].id);
        chose.total += autoCoupons[ i ].amount;
      }
      _.merge(param, { couponsIdGroup: chose.couponsIdGroup });
    } else {
      // 不可以选择多个优惠券
      _.merge(param, { couponId: _.get(autoCoupons, '[0].id') });
      chose.couponId = _.get(autoCoupons, '[0].id');
      chose.total = _.get(autoCoupons, '[0].amount');
      chose.used = true;
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
   * 选择优惠券
   * @param coupon 优惠券
   */
  handleClickChooseCoupon(coupon) {
    const { dispatch, goodsId, goodsType } = this.props
    const { multiCoupons } = this.state;
    let coupons = _.get(this.state, 'coupons', [])
    coupons = this.filterCoupons(coupons, goodsType)
    let chose = _.get(this.state, 'chose', {});
    dispatch(startLoad())
    let param = { goodsId: goodsId, goodsType: goodsType }
    if(multiCoupons) {
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
        chose.couponsIdGroup.push(coupon.id);
      }
      _.merge(param, { couponsIdGroup: chose.couponsIdGroup });
    } else {
      // 不可以选择多个优惠券
      _.merge(param, { couponId: coupon.id });
      chose.couponId = coupon.id;
      chose.total = coupon.amount;
      chose.used = true;
    }

    if(_.isEmpty(chose.couponsIdGroup) && !chose.couponId) {
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
    coupons = this.filterCoupons(coupons, goodsType)
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

  render() {
    const { openCoupon, final, fee, chose, free, show, name, startTime, endTime, activity, multiCoupons, chooseAll, initPrice } = this.state
    const { header, goodsId, goodsType } = this.props
    let coupons = _.get(this.state, 'coupons', [])
    coupons = this.filterCoupons(coupons, goodsType)
    const hasCoupons = !_.isEmpty(coupons)

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
      return priceArr
    }

    const couponChosen = (item) => {
      if(multiCoupons) {
        return _.indexOf(_.get(chose, 'couponsIdGroup'), item.id) !== -1
      } else {
        return _.isEqual(_.get(chose, 'couponId'), item.id);
      }
    }

    // <!-- render内容如下：如果是安卓4.3以下版本的话，则渲染简化页面，否则渲染正常页面 -->
    if(window.ENV.osName === 'android' && parseFloat(window.ENV.osVersion) <= 4.3) {

      // <!-- 安卓4.3 以下 -->
      return (
        <div className={`simple-pay-info ${show ? 'show' : ''}`}>
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
          </div>
          <div className="btn-container">
            <div className="btn" onClick={() => this.handleClickPay()}/>
          </div>
        </div>
      )
    } else {
      // <!--  非安卓4.3 -->
      return (<div className={`pay-info ${show ? 'show' : ''} ${hasCoupons ? 'hasCoupons' : ''}`}>
        {show ? <div className={`close ${hasCoupons ? 'hasCoupons' : ''}`} onClick={() => this.handleClickClose()}>
          <Icon type="white_close_btn" size="40px"/>
        </div> : null}

        <div className={`main-container ${hasCoupons ? 'hasCoupons' : ''} ${show ? 'show' : ''}`}>
          <div className={`header ${openCoupon ? 'openCoupon' : ''}`}>
            {header || name}
          </div>
          <div className={`content ${openCoupon ? 'openCoupon' : ''}`}>
            <div className="price item">
              {renderPrice(fee, final, free, initPrice)}
            </div>
            {!!startTime && !!endTime ? <div className="open-time item">
              有效时间：{startTime} - {endTime}
            </div> : null}
            {hasCoupons ?
              <div
                className={`coupon item  ${openCoupon && multiCoupons ? 'no-arrow' : ''} ${openCoupon ? 'open' : ''}`}
                onClick={() => this.setState({ openCoupon: !this.state.openCoupon })}>
                {chose && chose.used ? `优惠券：¥${numeral(chose.total).format('0.00')}元` : `选择优惠券`}
                {openCoupon && multiCoupons ?
                  <div className="coupon-manual-close">
                    确认
                  </div> : null}
              </div> : null}
          </div>
          <ul className={`coupon-list ${openCoupon ? 'open' : ''}`}>
            {multiCoupons ? (
              <div className="choose-all-wrapper">
                <div className="choose-area">
                  <div className="choose-all-tips">全选</div>
                  <div className={`choose-all ${chooseAll ? 'chose' : ''}`} onClick={() => this.handleClickChooseAll()}>
                    <div className="btn">
                    </div>
                    <div className="mask">
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            {coupons ? coupons.map((item, seq) => {
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
                  <div
                    className={`
                       coupon-btn ${multiCoupons ? 'multiCoupons' : ''} ${couponChosen(item) ? 'chose' : ''}`}
                    onClick={() => this.handleClickChooseCoupon(item)}>
                    <div className={`btn ${multiCoupons ? 'multiCoupons' : ''} `}>
                    </div>
                    <div className={`mask ${multiCoupons ? 'multiCoupons' : ''} `}>
                    </div>
                  </div>
                </li>
              )
            }) : null}
          </ul>
        </div>
        <div className={`btn-container ${openCoupon ? 'openCoupon' : ''}`}>
          <div className="btn" onClick={() => this.handleClickPay()}>
            确认支付
          </div>
        </div>
        {show ? <div className="mask"/> : null}
      </div>)
    }
  }
}
