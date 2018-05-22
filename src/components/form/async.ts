import { pget, ppost } from "utils/request";

/**
 * 提交图片
 */
export function uploadImage(param) {
  return ppost("/file/image/upload/2", param);
}
