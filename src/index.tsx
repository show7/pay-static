import { importExternalCss, importExternalJs } from './utils/dom'

require('es6-promise').polyfill();
import "babel-polyfill";
import "./style.less"
// import "whatwg-fetch"
import * as React from "react"
import { render } from "react-dom"
import { Router, browserHistory } from "react-router"
import { Provider } from "react-redux"
import configureStore from "./redux/configureStore"
import routes from "./routes"
import "weui"
import 'animate.css/animate.min.css'

// 腾讯视频样式
importExternalCss('//imgcache.qq.com/open/qcloud/video/tcplayer/tcplayer.css')
// 腾讯视频 js
importExternalJs('//imgcache.qq.com/open/qcloud/video/tcplayer/tcplayer.min.js')

// const FastClick = require("fastclick")
// import { config } from "modules/helpers/JsConfig"

const store = configureStore()

declare var window: {
	ENV
}

// FastClick.attach(document.body);

render(
	<Provider store={store}>
		<Router history={browserHistory} routes={routes} />
	</Provider>
	, document.getElementById(window.ENV.reactMountPoint))

var fontSize = 0
if(document.body.clientWidth > 414) {
	fontSize = 414 / 37.5
} else {
	fontSize = document.body.clientWidth / 37.5
}
document.getElementsByTagName('html')[0].style.fontSize = fontSize + 'px'
