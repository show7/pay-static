import { pget, mark, log } from "utils/request"
import * as _ from "lodash";

/**
 * 调用微信支付的config参数
 */
interface ConfigParamProps {
  appId: string,
  timestamp: string,
  nonceStr: string,
  signature: string
}

/**
 * 缓存的config对象
 */
class ConfigBean {
  url: string; // 这个config参数的url
  configParam: ConfigParamProps; // 后端签发的config参数
  configTimes: number; // config失败次数
  error: boolean; // 是否异常
  constructor() {
    this.error = false;
    this.configTimes = 0;
  }
}

let whiteList = [
  '/pay/alipay/rise'
];

/**
 * 微信JS SDK签名服务
 */
class JsConfigService {
  private configList: [ ConfigBean ]; // url签名参数缓存队列
  static MAX_CONFIG_SIZE = 10; // url签名参数缓存的最大数量

  constructor() {
    // 初始化configList
    this.configList = new Array<ConfigBean>();
  }

  private getConfigBean(url) {
    return _.get(_.filter(this.configList, { url: url }), '[0]', null);
  }

  /**
   *
   * @param url
   * @param param
   */
  private setConfigBean(url, param) {
    let configBean = this.getConfigBean(url);
    if(_.isNull(configBean)) {
      configBean = new ConfigBean();
      configBean.url = url;
      configBean.configParam = param;
      configBean.error = false;
      // 最多存储10个
      if(this.configList.length > JsConfigService.MAX_CONFIG_SIZE) {
        this.configList.shift();
      }
      // alert('config 1:'+url+":"+JSON.stringify(configBean));
      this.configList.push(configBean);
    } else {
      configBean.configParam = param;
      configBean.error = false;
      configBean.configTimes = 0;
      // alert('config 2:'+url+":"+JSON.stringify(configBean));
    }
  }

  /**
   * config参数异常
   * @param url url
   * @param e 异常信息
   * @param apiList apiList
   * @param callback 回调函数
   */
  private setConfigParamError(url, e, apiList, callback) {
    let configBean = this.getConfigBean(url);
    if(!_.isNull(configBean)) {
      // 这个url有config参数
      configBean.configTimes += 1;
      // console.log('configTimes', configBean.configTimes);
      if(configBean.configTimes >= 3) {
        // 错误次数大于3则打日志,并放弃config
        configBean.error = true;
        let memo = "url:" + window.location.href + ",configUrl:" + window.ENV.configUrl
          + ",os:" + window.ENV.systemInfo + ",signature:" + JSON.stringify(configBean);
        if(e) {
          memo = 'error:' + JSON.stringify(e) + ',' + memo;
        }
        log({
          module: "JSSDK",
          function: window.ENV.systemInfo,
          action: "签名失败",
          memo: memo
        }, url);
      } else {
        // 错误次数小于3次则再次调用config
        this.config(apiList, callback);
      }
    }
  }

  /**
   * 真正进行config的地方
   */
  private jsConfig(apiList = [], callback) {
    // 获取url
    let url = this.getUrl();
    // alert(url);
    // 获取config参数
    let configBean = this.getConfigBean(url);
    if(!_.isNull(configBean)) {
      wx.config(_.merge({
        debug: false,
        jsApiList: [ 'hideOptionMenu', 'showOptionMenu', 'onMenuShareAppMessage', 'onMenuShareTimeline', 'closeWindow' ].concat(apiList),
      }, configBean.configParam));
      wx.error((e) => {
        let url = this.getUrl();
        // alert("error："+JSON.stringify(e)+';'+url);
        this.setConfigParamError(url, e, apiList, callback);
      })
      wx.ready(() => {
        // 默认不隐藏
        let hideMenu = false;
        for(let i = 0; i < whiteList.length; i++) {
          let url = whiteList[ i ];
          if(url.indexOf(window.location.pathname) !== -1) {
            hideMenu = false;
            break;
          }
        }
        if(hideMenu) {
          // 隐藏分享按钮
          wx.hideOptionMenu();
        } else {
          // 显示分享按钮
          wx.showOptionMenu();
        }
        if(callback && _.isFunction(callback)) {
          callback();
        }
      })
    } else {
      // 进入这个页面，但是返回的参数里却没有这个url，说明切页面切的太快了，等其他的config吧
      // alert("final url"+url);
    }
  }

  /**
   * 根据当前的url／系统，获取调用config方法的url
   * @returns {any}
   */
  private getUrl() {
    if(window.ENV.osName === 'ios') {
      return window.ENV.configUrl ? window.ENV.configUrl.split('#')[ 0 ] : window.location.href.split('#')[ 0 ];
    } else {
      return window.location.href.split('#')[ 0 ];
    }
  }

  /**
   * 进行config
   * @param apiList apiList
   * @param callback 回调函数
   */
  public config(apiList = [], callback) {
    // 获取config用的url
    let url = this.getUrl();
    // 获取这个url的config参数
    let configBean = this.getConfigBean(url);
    if(!_.isNull(configBean) && !configBean.error) {
      // 没有config参数，并且这个参数没有异常(失败超过三次)
      // console.log('已经有了config', configBean);
      // 调用签名方法
      this.jsConfig(apiList, callback);
    } else {
      // 没有有效的config参数，拉取config信息
      // console.log("没有config");
      pget(`/wx/js/signature?url=${encodeURIComponent(url)}`).then(res => {
        // 获取成功，设置这个url的config参数
        this.setConfigBean(url, res.msg);
        setTimeout(() => {
          // 延迟1秒调用config
          this.jsConfig(apiList, callback);
        }, 1000);
      }).catch(e => {
        console.log(e);
      });
    }
  }

  public configShare(title, url, imgUrl, desc, apiList = []) {
    pget(`/wx/js/signature?url=${encodeURIComponent(window.location.href)}`).then(res => {
      if(res.code === 200) {
        wx.config(_.merge({
          debug: false,
          jsApiList: [ 'onMenuShareAppMessage', 'onMenuShareTimeline' ].concat(apiList),
        }, res.msg))
        wx.ready(() => {
          setTimeout(() => {
            wx.showOptionMenu();
          }, 1500)
          // hideOptionMenu()
          wx.onMenuShareTimeline({
            title: title, // 分享标题
            link: url, // 分享链接
            imgUrl: imgUrl, // 分享图标
          });
          // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
          wx.onMenuShareAppMessage({
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: url, // 分享链接
            imgUrl: imgUrl, // 分享图标
            type: 'link', // 分享类型,music、video或link，不填默认为link
          });
        })
        wx.error(function(e) {
          console.log(e)
        })
      } else {
      }
    }).catch((err) => {
    })
  }
}

export default new JsConfigService();
