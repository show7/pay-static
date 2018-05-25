import { pget, ppost } from 'utils/request'

/**
 * 获取支付信息
 */
export function loadPaymentParam(param) {
  return ppost('/signup/load/pay/param', param)
}

/**
 * 计算优惠券信息
 */
export function calculateCoupons(param) {
  return ppost('/signup/payment/coupon/calculate', param)
}

/**
 * 记录支付数据
 * @param functionValue 对应function字段
 * @param type 打点类型，记录到action字段
 * @param param 参数，记录到memo
 */
export function logPay(functionValue, type, param) {
  pget(`/signup/mark/pay/${functionValue}/${type}${param ? '?param=' + param : ''}`)
}

/**
 * 支付成功后的回调
 */
export function afterPayDone(productId) {
  return ppost(`/signup/paid/rise/${productId}`)
}

export function getRiseMember(riseMember) {
  return pget(`/signup/rise/member/${riseMember}`)
}

export function checkRiseMember(riseMember,riseId) {
  return pget(`/signup/rise/member/check/${riseMember}?riseId=${riseId}`)
}

export function entryRiseMember(riseMember) {
  return pget(`/signup/rise/member/entry/${riseMember}`)
}

/**
 * 加载商品信息
 * @param goodsType 商品类型
 * @param goodsId 商品id
 */
export function loadGoodsInfo(goodsType, goodsId) {
  return ppost('/signup/load/goods', { goodsType: goodsType, goodsId: goodsId })
}

export function chooseAuditionCourse() {
  return ppost('/rise/plan/choose/audition/course')
}

/**
 * 检查当前用户是否是一带二或者年终回顾用户
 */
export function checkPromotionOrAnnual() {
  return pget(`/rise/prize/jan/pay/check`)
}

export function loadApplyProjectInfo(param: { applyId, wannaGoodsId }) {
  return pget('/signup/apply/project/mapping', param);
}

/**
 * 获取 （商业思维）优惠卷信息
 * @param param
 * @returns {any}
 */
export function loadInvitation(param) {
    return ppost('/rise/share/receive/coupons', param);
 }

/**
 * 导流课 获取优惠券信息
 * @param param
 * @returns {any}
 */
export function loadDirectPosterInvitation(param) {
    return ppost('/rise/share/receive/camp/coupons', param);
}

export function loadCheckBuy() {
    return pget('/signup/rise/member/check/can/pay');
}