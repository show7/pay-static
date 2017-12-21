import { pget, ppost } from "utils/request";

/**
 * 获取支付信息
 */
export function uploadImage(param) {
  return ppost('/signup/load/pay/param', param);
}
