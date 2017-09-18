import * as React from "react"
import { connect } from "react-redux"
import { isPending } from "utils/helpers"
import { Toast, Dialog } from "react-weui"
import { set } from "redux/actions"
import { config } from "../helpers/JsConfig"
const P = "base"
const LOAD_KEY = `${P}.loading`
const SHOW_MODAL_KEY = `${P}.showModal`
const { Alert } = Dialog
import UA from "ua-device";
import {toLower,get} from "lodash";

@connect(state => state)
export default class Main extends React.Component<any, any> {

	constructor() {
		super()
		this.state = {
			alert: {
				buttons: [
					{
						label: '关闭',
						onClick: this.closeAnswer.bind(this)
					}
				]
			},
		}
		window.ENV.Detected = new UA(window.navigator.userAgent);
    window.ENV.osName = toLower(get(window,'ENV.Detected.os.name'));
    window.ENV.osVersion = toLower(get(window,'ENV.Detected.os.version.original'));
    window.ENV.systemInfo = window.ENV.osName + ":" +  window.ENV.osVersion;
	}

	componentDidMount(){
    config(['chooseWXPay'])
  }

	closeAnswer() {
		const { dispatch } = this.props
		dispatch(set(SHOW_MODAL_KEY, false))
	}

	render() {
		return (
			<div>
				{this.props.children}
				<Toast show={isPending(this.props, LOAD_KEY)} icon="loading">
					加载中...
				</Toast>
				<Alert { ...this.state.alert }
					show={this.props.base.showModal}>
          <pre className="global-pre">{this.props.base.alertMsg}</pre>
				</Alert>
			</div>
		)
	}
}
