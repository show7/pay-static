import * as _ from 'lodash'
import sa from 'sa-sdk-javascript';

export function isPending(state, key): boolean {
  return _.get(state, '$view.$pending') ? _.get(state, '$view.$pending')[ key ] : false
}

export function changeTitle(title) {
  document.title = title
  const iframe = document.createElement('iframe')
  iframe.style.cssText = 'display: none; width: 0; height: 0;'
  iframe.src = 'https://static.iqycamp.com/images/logo.png?imageslim'
  //iframe.src = require('./img/text_delete.png');
  const listener = () => {
    setTimeout(() => {
      iframe.removeEventListener('load', listener)
      setTimeout(() => {
        document.body.removeChild(iframe)
      }, 0)
    }, 0)
  }
  iframe.addEventListener('load', listener)
  document.body.appendChild(iframe)
}

export class GoodsType {
  public static SYSTEMATISM = 'systematism'
  public static FRAG_COURSE = 'fragment_rise_course'
  public static FRAG_MEMBER = 'fragment_member'
  public static FRAG_CAMP = 'fragment_camp'
  public static BS_APPLICATION = 'bs_application'
  public static COMBAT = 'actual_combat'
}

export class PayType {
  // public static WECHAT = 1;
  public static WECHAT = 7;
  public static ALIPAY = 2;
  public static KFQ = 3;
  public static HUABEI_3 = 4;
  public static HUABEI_6 = 5;
  public static HUABEI_12 = 6;
}

export class CouponCategory {
  /**
   * 只能用来购买会员
   */
  public static ONLY_MEMBERSHIP = "ELITE_RISE_MEMBER";
  /**
   * 只能用来够买线下工作坊
   */
  public static ONLY_WORKSHOP = "OFF_LINE_WORKSHOP";
}

export const getGoodsType = (id) => {
  switch(id) {
    case 3:
      return GoodsType.FRAG_MEMBER
    case 5:
      return GoodsType.FRAG_CAMP
    case 7:
      return GoodsType.BS_APPLICATION
    case 9:
      return GoodsType.BS_APPLICATION
    case 8:
      return GoodsType.FRAG_MEMBER;
  }
}

function scrollLimit(e) {
  let _this = this;
  if(_this.scrollTop >= _this.scrollHeight - _this.clientHeight - 1) {
    _this.scrollTop = _this.scrollHeight - _this.clientHeight - 1;
  } else if(_this.scrollTop <= 1) {
    _this.scrollTop = 1;
  }
}

export function unScrollToBorder(selector) {
  let dom = document.querySelector(selector);
  if(dom) {
    dom.addEventListener('scroll', scrollLimit)
    return () => {
      dom.removeEventListener('scroll', scrollLimit)
    };
  } else {
    // return 空函数，防止报错
    return () => {};
  }
}

export function lockWindow() {
  document.body.style.height = '100vh'
  document.body.style.overflow = 'hidden'
}

export function unlockWindow() {
  document.body.style.height = 'inherit'
  document.body.style.overflow = 'inherit'
}

const notLoadInfoUrls = [ "/pay/alipay/rise", "/pay/alipay/return" ];
export { sa, notLoadInfoUrls }

export function refreshForPay() {
  // ios／安卓微信支付兼容性
  if(!_.isEmpty(window.ENV.configUrl) &&
    window.ENV.configUrl !== window.location.href) {
    console.log("微信sdk需要刷新页面")
    window.location.href = window.location.href
    return true;
  } else {
    return false;
  }
}

export function saTrack(event, param) {
  console.log('track', event, param);
  if(!!param) {
    sa.track(event, param);
  } else {
    sa.track(event);
  }
}

/**
 * 生成随机字符串
 */
export function randomStr (len) {
  len = len || 32
  let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  let maxPos = $chars.length
  let pwd = ''
  for (let i = 0; i < len; i++) {
    pwd = pwd + $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}
/**
 * 获取参数
 * @param url 链接
 * @param name 获取参数名
 * @return {*} 参数值
 */
export function getQueryString (url, name) {
  if (!url) {
    return null
  }
  let urlArr = url.split('?')
  if (urlArr.length !== 2) {
    return null
  }
  let query = urlArr[1]
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  let r = query.match(reg)
  if (r != null) {
    return unescape(r[2])
  }
  return null
}




