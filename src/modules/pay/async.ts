import {pget, ppost} from 'utils/request'

/**
 * 获取支付信息
 */
export function loadPaymentParam(param) {
  return ppost('/signup/load/pay/param', param)
}
/**
 * 是否购买过测评售卖课程
 */
export const courseBuyValidate = () => pget('/rise/survey/validate')
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
  pget(
    `/signup/mark/pay/${functionValue}/${type}${param ? '?param=' + param : ''}`
  )
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

export function checkRiseMember(riseMember, riseId, type) {
  if (type == 2) {
    return pget(
      `/signup/rise/member/check/${riseMember}?riseId=${riseId}&type=${type}`
    )
  } else {
    return pget(`/signup/rise/member/check/${riseMember}?riseId=${riseId}`)
  }
}

export function entryRiseMember(riseMember) {
  return pget(`/signup/rise/member/entry/${riseMember}`)
}

/**
 * 加载商品信息
 * @param goodsType 商品类型
 * @param goodsId 商品id
 */
export function loadGoodsInfo(goodsType, goodsId, priceActivityId) {
  return ppost('/signup/load/goods', {
    goodsType: goodsType,
    goodsId: goodsId,
    priceActivityId: priceActivityId,
  })
}

export function loadWannaMember(goodsId) {
  return pget('/signup/wanna/member', {goodsId: goodsId})
}

/**
 * 获取 （商业思维）优惠卷信息
 * @param param
 * @returns {any}
 */
export function loadInvitation(param) {
  return ppost('/rise/share/receive/coupons', param)
}

/*得到贡献值*/
export function loadTask(type) {
  return pget(`/rise/contribution/load/task/contribution?taskId=${type}`)
}

/**
 * 获取音频课信息
 */
export function loadActivityCheck(goodsId, param) {
  return pget(`/signup/rise/member/activity/check/${goodsId}`, param)
}

export function checkAudio(param) {
  return pget(`/signup/rise/member/audio/check?channel=${param}`)
}

export function joinAudioCourse(param) {
  return ppost(`/promotion/audio/join`, param)
}

export function joinChallengeAudio(source) {
  return ppost(`/promotion/audio/challenge/join`, {source: source})
}

export function autoJoinReadCourse(source) {
  return ppost(`/promotion/audio/camp/open`, {source: source})
}

export function autoJoinAudioCourse(riseId) {
  return ppost(`/promotion/audio/auto/open`, {riseId: riseId})
}

export function checkCanPay() {
  return pget('/signup/rise/member/audio/pay/check')
}

export function loadRotate(param) {
  return pget(`/promotion/audio/load/rotate?activityId=${param}`)
}

export function checkGoodsInfo(param) {
  return pget(`/signup/rise/member/audio/load/goods?goodsId=${param}`)
}

export function exchangeRiseMemberByCode(exchangeCode, goodsId) {
  return ppost(`/exchange/card/exchange`, {
    exchangeCode: exchangeCode,
    goodsId: goodsId,
  })
}
