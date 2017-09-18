import qs from "qs"
import { get, post } from "axios"
import * as $ from "jquery";

export function appendQs(query: Object): string {
	return !query ? "" : `?${qs.stringify(query)}`
}

export function mark(param){
  return ppost('/rise/b/mark',param);
}

export function pget(url: string, query?: Object) {
	return get(`${url}${appendQs(query)}`).then((res) => res.data).catch(error => {
		if (error.response) {
      log(JSON.stringify(error.response), window.location ? window.location.href : null, JSON.stringify(getBrowser()));
		} else {
			log(error.message, window.location ? window.location.href : null, JSON.stringify(getBrowser()));
		}
	})
}

export function ppost(url: string, body: Object) {
	return post(url, body).then((res) => res.data).catch(error => {
		if (error.response) {
      log(JSON.stringify(error.response), window.location ? window.location.href : null, JSON.stringify(getBrowser()));

    } else {
      log(error.message, window.location ? window.location.href : null, JSON.stringify(getBrowser()));
    }
	})
}

export function getBrowser(){
  return {
    versions: function () {
      var u = navigator.userAgent, app = navigator.appVersion;
      return {//移动终端浏览器版本信息
        trident: u.indexOf('Trident') > -1, //IE内核
        presto: u.indexOf('Presto') > -1, //opera内核
        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile/i) || !!u.match(/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/), //是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
        iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
        iPad: u.indexOf('iPad') > -1, //是否iPad
        webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
      };
    } (),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
  }
}

export function getPlatform(){
  let browser = getBrowser();
  if (browser.versions.iPhone || browser.versions.iPad || browser.versions.ios){
    return "ios";
  } else {
    return "android";
  }
}

export function log(msg,url,browser) {
  $.ajax('/b/log',{
    type: "POST",
    contentType:"application/json",
    data: JSON.stringify({ result: msg, cookie: document.cookie,url:url,browser:browser }),
    dataType:"json",
    success: function(e){console.log(e)},
  });
	// ppost('/b/log', { result: msg, cookie: document.cookie,url:url,browser:browser })
}
