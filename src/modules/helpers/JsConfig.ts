import {pget, mark} from "utils/request"
import * as _ from "lodash"
import JsConfigService from "./JsConfigService"


export function config(apiList,callback){
  JsConfigService.config(apiList,callback);
}

export function preview(current, picList) {
  wx.previewImage({
    current: current, // 当前显示图片的http链接
    urls: picList // 需要预览的图片http链接列表
  });
}

export function closeWindow(current, picList) {
  wx.closeWindow();
}

export function hideOptionMenu(current, picList) {
  wx.hideOptionMenu();
}

export function configShare(title, url, imgUrl, desc, apiList = []){
  JsConfigService.configShare(title, url, imgUrl, desc, apiList);
}


export function pay(config, success, cancel, error) {
  WeixinJSBridge.invoke(
    'getBrandWCPayRequest', config,
    (res) => {
      if(res.err_msg == "get_brand_wcpay_request:ok") {
        if(success && _.isFunction(success)) {
          success();
        }
      }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
      else if(res.err_msg == "get_brand_wcpay_request:cancel") {
        if(cancel && _.isFunction(cancel)) {
          cancel(res);
        }
      } else {
        if(_.isFunction(error)) {
          error(res);
        }
      }
    }
  );
}