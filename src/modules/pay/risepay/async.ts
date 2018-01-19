import { pget, ppost } from 'utils/request'

/**
 * 加载当前用户的profile
 */
export function loadRiseId() {
  return pget(`/recommend/get/rise`)
}

/**
 *
 */
export function addUserRecommendation(id) {
  return pget(`/recommend/add/user/${id}`)
}

export function queryOrderSuccess(orderId) {
  return pget(`/signup/order/success`, { orderId: orderId });
}
