import { pget, ppost } from 'utils/request'

export function signupCamp() {
  return pget('/signup/current/camp/month')
}

export function createCampGroup() {
  return ppost('/rise/operation/group/create')
}

export function isFollowing(groupCode) {
  return pget(`/rise/operation/group/following?groupCode=${groupCode}`)
}

export function joinCampGroup(groupCode) {
  return ppost(`/rise/operation/group/participate?groupCode=${groupCode}`)
}

export function getLeaderInfo(groupCode) {
  return pget(`/rise/operation/group/leader?groupCode=${groupCode}`)
}

export function getCampPageInfo() {
  return pget('/signup/guest/camp/sell/info')
}

/**
 * 获取投资项目优惠券领取状态
 * @param riseId 分享链接的 riseId
 */
export function loadShareOperationStatus(riseId) {
  return pget('/rise/operation/share/status', { riseId: riseId })
}

/**
 * 领取投资项目优惠券
 * @param riseId 分享链接的 riseId
 */
export function receiveShareCoupon(riseId) {
  return ppost('/rise/operation/share/receive/coupon?riseId=' + riseId)
}