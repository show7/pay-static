require('es6-promise').polyfill();
import "babel-polyfill";
import "./style.less"
import "whatwg-fetch"
import * as React from "react"
import { render } from "react-dom"
import { Router, browserHistory } from "react-router"
import { Provider } from "react-redux"
import configureStore from "./redux/configureStore"
import routes from "./routes"
import "weui"

// const FastClick = require("fastclick")
import { config } from "modules/helpers/JsConfig"

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
