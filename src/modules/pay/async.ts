import { pget, ppost } from "utils/request";

/**
 * 获取支付信息
 */
export function loadPaymentParam(param) {
  console.log('param', param)
  return ppost('/signup/load/pay/param', param);
}

/**
 * 计算优惠券信息
 */
export function calculateCoupons(param) {
  return ppost('/signup/payment/coupon/calculate', param);
}

/**
 * 记录支付数据
 * @param functionValue 对应function字段
 * @param type 打点类型，记录到action字段
 * @param param 参数，记录到memo
 */
export function logPay(functionValue, type, param) {
  pget(`/signup/mark/pay/${functionValue}/${type}${param ? '?param=' + param : ''}`);
}

/**
 * 支付成功后的回调
 */
export function afterPayDone(productId) {
  return ppost(`/signup/paid/rise/${productId}`);
}

export function loadPayParam(param) {
  return ppost('/signup/rise/course/pay', param);
}

export function loadUserCoupons() {
  return pget(`/signup/coupon/list`);
}

export function mark(param) {
  return ppost('/rise/b/mark', param);
}

/**
 * 加载商品信息
 * @param goodsType 商品类型
 * @param goodsId 商品id
 */
export function loadGoodsInfo(goodsType, goodsId) {
  return ppost('/signup/load/goods', { goodsType: goodsType, goodsId: goodsId });
}

