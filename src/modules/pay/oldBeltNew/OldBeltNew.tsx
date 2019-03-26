import React, {Component} from 'react'
import {connect} from 'react-redux'
import {set, startLoad, endLoad, alertMsg} from 'redux/actions'
import {getQuery} from '../../../utils/getquery'
import {mark} from 'utils/request'
import {pay, config, configShare} from '../../helpers/JsConfig'

import {
  checkRiseMember,
  getRiseMember,
  loadGoodsInfo,
  loadPaymentParam,
  courseBuyValidate,
  logPay,
  calculateCoupons,
  loadInvitation,
  loadTask,
} from '../async'

import './OldBeltNew.less'
enum payType {
  WECHAT = 1,
  ALIPAY = 8,
  HUABEI = 8,
}
@connect(state => state)
export default class OldBeltNew extends Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      selectPayIndex: 0,
      payTypeMap: [payType.WECHAT, payType.ALIPAY, payType.HUABEI],
      isShowCouponSelect: false,
      coupons: [],
      subjectinfor: {},
      couponsIdGroup: [],
      couponTip: '',
      favorablePrice: '',
    }
  }
  async componentDidMount() {
    const {dispatch} = this.props
    const goodsId = getQuery('goodsId') || ''
    try {
      const {code: riseCode, msg: riseMsg} = await getRiseMember(goodsId)
      if (riseCode !== 200) throw '信息校验失败'
      const {quanwaiGoods} = riseMsg
      const {goodsType, priceActivityId = ''} = quanwaiGoods
      this.setState({goodsType, goodsId})

      const {code: loadCode, msg: loadMsg} = await loadGoodsInfo(
        goodsType,
        goodsId,
        priceActivityId
      )
      if (loadCode !== 200) throw '加载商品信息失败'
      const {
        coupons,
        autoCoupons,
        name,
        fee,
        multiCoupons,
        sellingDeadline,
        openDate,
      } = loadMsg
      let autoCouponsIdList = autoCoupons.map(item => item.id)
      coupons.forEach(coupon => {
        Object.assign(coupon, {isSelect: autoCouponsIdList.includes(coupon.id)})
      })
      console.log('coupons', coupons)
      this.setState({
        coupons,
        multiCoupons,
        subjectinfor: {name, fee, sellingDeadline, openDate},
      })
      this.setCoupon()
    } catch (e) {
      dispatch(alertMsg(e))
    }
  }
  async goPay() {
    const {riseId = '', type = 0} = this.props
    const {goodsId, goodsType} = this.state
    const {dispatch} = this.props

    try {
      const {code: checkCode, msg: checkMsg} = await checkRiseMember(
        goodsId,
        riseId,
        type
      )
      if (checkCode !== 200) throw '支付校验失败'
      const {privilege, errorMsg} = checkMsg
      console.log(privilege)
      if (!privilege) throw errorMsg
      const {selectPayIndex, payTypeMap, couponsIdGroup} = this.state
      const mobile = this.refs.mobile.value
      if (!/^1[34578]\d{9}$/.test(mobile))
        return dispatch(alertMsg('请检查手机号格式是否有误'))
      mark({
        module: '购课落地页',
        function: '支付页',
        action: '进入支付页后输入手机号',
        memo: `mobile=${mobile}`,
      })
      const payMap = ['微信', '支付宝', '花呗']
      mark({
        module: '购课落地页',
        function: '支付页',
        action: '进入支付页后选择支付方式',
        memo: `payType=${payMap[selectPayIndex]}`,
      })
      mark({
        module: '购课落地页',
        function: '支付页',
        action: '点击立即支付',
        memo: `mobile=${mobile}&payTypeMap=${payTypeMap[selectPayIndex]}`,
      })
      const params = {
        goodsType,
        goodsId,
        payType: payTypeMap[selectPayIndex],
        couponsIdGroup,
        mobile,
      }
      const {code: loadPayCode, msg: loadPayMsg} = await loadPaymentParam(
        params
      )
      const {fee, free, signParams, productId} = loadPayMsg
      if (loadPayCode !== 200) throw '获取支付信息失败'
      if (!Number(fee) && free) return this.handlePayDone()
      payTypeMap[selectPayIndex] === payType.WECHAT
        ? this.handleH5Pay(signParams, goodsType)
        : (window.location.href = `/pay/alipay/rise?orderId=${productId}&goto=${encodeURIComponent(
            signParams.alipayUrl
          )}&type=hb`)
      console.log('goodsInfor', goodsType)
    } catch (e) {
      dispatch(alertMsg(e))
    }
  }
  /**
   * 调起H5支付
   * @param signParams
   */
  handleH5Pay(signParams, goodsType = '未知商品') {
    this.reConfig()
    let functionName = goodsType
    mark({
      module: '支付',
      function: functionName,
      action: '开始支付',
      memo: 'url:' + window.location.href + ',os:' + window.ENV.systemInfo,
    })

    const {dispatch} = this.props
    if (!signParams) {
      mark({
        module: '支付',
        function: functionName,
        action: '没有支付参数',
        memo: 'url:' + window.location.href + ',os:' + window.ENV.systemInfo,
      })
      dispatch(alertMsg('支付信息错误，请刷新'))
      return
    }
    if (window.ENV.osName === 'windows') {
      // windows客户端
      mark({
        module: '支付',
        function: functionName,
        action: 'windows-pay',
        memo: 'url:' + window.location.href + ',os:' + window.ENV.systemInfo,
      })
      dispatch(alertMsg('Windows的微信客户端不能支付哦，请在手机端购买课程～'))
    }
    // 调起H5支付
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
        if (_.isFunction(this.props.payedError)) {
          this.payedError(res)
        }
      }
    )
  }
  handlePayDone() {
    //成功跳转到报名成功页面
    mark({
      module: '购课落地页',
      function: '支付页',
      action: '进入支付成功页面的人数',
      memo: '进入支付成功页面的人数',
    })
    this.context.router.push({
      pathname: '/pay/member/success',
    })
  }
  setCoupon() {
    const {coupons} = this.state
    const couponsCroup = coupons
      .map(item => (item.isSelect ? item : ''))
      .filter(id => id !== '')
    const couponsIdGroup = couponsCroup.map(item => item.id)
    let favorablePrice = couponsCroup.reduce((pre, cur) => pre + cur.amount, 0)
    const couponTip =
      !!couponsCroup && couponsCroup.length
        ? couponsCroup.length == 1
          ? `${couponsCroup[0].amount}元优惠劵`
          : `${couponsCroup.length}张优惠劵合计${favorablePrice}元`
        : '未选择优惠劵'

    console.log(favorablePrice)
    this.setState({
      couponsIdGroup,
      couponTip,
      favorablePrice,
    })
  }
  selectedCoupon(i) {
    const {dispatch} = this.props
    const {coupons, multiCoupons} = this.state
    if (multiCoupons) {
      coupons[i].isSelect = !coupons[i].isSelect
    } else {
      let SelectArr = coupons.filter(item => (item.isSelect ? item.id : ''))
      !!SelectArr
        ? dispatch(alertMsg('本次订单只能选择一张优惠劵呢～'))
        : (coupons[i].isSelect = !coupons[i].isSelect)
    }
    this.setCoupon()
    this.setState({
      coupons,
    })
  }
  /**
   * 重新注册页面签名
   */
  reConfig() {
    config(['chooseWXPay'])
  }
  payedError() {
    // 支付失败
  }
  render() {
    const payModelist = [
      {
        payName: '微信支付',
        payIcon: 'https://static.iqycamp.com/02-hgf9x2um.png',
      },
      {
        payName: '支付宝',
        payIcon: 'https://static.iqycamp.com/03-w6zbyuag.png',
      },
      {
        payName: '支付宝花呗(支持分期)',
        payIcon: 'https://static.iqycamp.com/04-2ys3s3nr.png',
      },
    ]
    const {
      selectPayIndex,
      isShowCouponSelect,
      coupons,
      subjectinfor,
      couponTip,
      favorablePrice,
    } = this.state
    const {name, fee, openDate, sellingDeadline} = subjectinfor
    const CouponSelectComponent = props => {
      const {isShow} = props
      return (
        <div
          className="coupon-select-wrap"
          style={{display: isShow ? 'block' : 'none'}}
        >
          <div className="coupon-box-wrap">
            <div
              className="close-coupon"
              onClick={() => {
                this.setState({isShowCouponSelect: false})
              }}
            >
              <img
                src="https://static.iqycamp.com/icon_X@2x-ze4vc2uw.png"
                alt=""
              />
            </div>
            <h1>优惠券</h1>
            {!!coupons && coupons.length > 0 ? (
              <ul>
                {coupons.map((coupon, i) => {
                  const {amount, isSelect, expired} = coupon
                  return (
                    <li
                      key={i}
                      onClick={() => {
                        this.selectedCoupon(i)
                      }}
                    >
                      <div>{amount}元优惠劵</div>
                      <div>
                        <span className="coupon-time">{expired}前使用</span>
                        <img
                          src={
                            isSelect
                              ? 'https://static.iqycamp.com/11881553238103_-cok78lwd.pic.jpg'
                              : 'https://static.iqycamp.com/11871553238103_-02irvze3.pic.jpg'
                          }
                          alt=""
                        />
                      </div>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <div className="zero-coupon">您的背包空空如也～</div>
            )}

            <div
              className="use-coupon"
              onClick={() => {
                this.setState({isShowCouponSelect: false})
              }}
            >
              确认使用
            </div>
          </div>
        </div>
      )
    }
    return (
      <div className="old-belt-new-wrap">
        <div>
          <div className="user-name">{window.ENV.userName}</div>
          <div className="input-wrap">
            <div className="input-befor" />
            <input
              className="phone-number"
              type="tel"
              ref="mobile"
              placeholder="请输入你的手机号"
            />
          </div>
        </div>
        <br />
        <div className="line" />
        <div className="course-information-wrap">
          <div>
            <div>{name}</div>
            <div>学费 ¥{fee}</div>
          </div>
          <div>
            <div>
              <div>报名截止日期</div>
              <div className="times">
                {sellingDeadline ? sellingDeadline.replace(/-/g, '.') : ''}
              </div>
            </div>
            <div>
              <div>开学时间</div>
              <div className="times">
                {openDate ? openDate.replace(/-/g, '.') : ''}
              </div>
            </div>
          </div>
        </div>
        <div
          className="coupon-wrap"
          onClick={() => {
            this.setState({isShowCouponSelect: true})
          }}
        >
          <div>
            <span>已选择：</span>
            <span>{couponTip}</span>
          </div>
          <div>
            {/* <span className="coupon-label">即将过期</span> */}
            <span className="coupon-right-icon">
              <img src="https://static.iqycamp.com/07-gx30yebq.png" alt="" />
            </span>
          </div>
        </div>
        <div className="line" />
        <ul className="pay-mode-wrap">
          {payModelist.map((item, i) => {
            return (
              <li
                onClick={() => {
                  this.setState({selectPayIndex: i})
                }}
              >
                <div>
                  <span className="pay-icon">
                    <img src={item.payIcon} alt="" />
                  </span>
                  <span>{item.payName}</span>
                </div>
                <div>
                  <div className="pay-select-wrap">
                    <img
                      src={
                        selectPayIndex === i
                          ? 'https://static.iqycamp.com/Group 20@3x-9im5a3jm.png'
                          : 'https://static.iqycamp.com/06-3xgco5b3.png'
                      }
                      alt=""
                    />
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
        <div className="fixed-button-wrap">
          <div className="submit-button" onClick={() => this.goPay()}>
            立即入学<span className="rmb-sign"> ¥</span>
            <span className="price">
              {fee - favorablePrice < 0 ? 0 : fee - favorablePrice}
            </span>
          </div>
        </div>
        <CouponSelectComponent isShow={isShowCouponSelect} />
      </div>
    )
  }
}
