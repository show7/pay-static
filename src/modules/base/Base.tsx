import * as React from 'react'
import { connect } from 'react-redux'
import { isPending } from 'utils/helpers'
import { Toast, Dialog } from 'react-weui'
import { set } from 'redux/actions'
import { config } from '../helpers/JsConfig'

const P = 'base'
const LOAD_KEY = `${P}.loading`
const SHOW_MODAL_KEY = `${P}.showModal`
import UA from 'ua-device'
import { toLower, get, merge } from 'lodash'
import $ from 'jquery'
import { pget } from '../../utils/request'
import sa from 'sa-sdk-javascript';

$.fn.extend({
  animateCss: function(animationName, callback) {
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend'
    this.addClass('animated ' + animationName).one(animationEnd, function() {
      $(this).removeClass('animated ' + animationName)
      if(callback) callback()
    })
    return this
  }
})

let notLoadInfoUrls = [ "/pay/alipay/rise", "/pay/alipay/return" ];

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
      showPage: false
    }
    window.ENV.Detected = new UA(window.navigator.userAgent)
    window.ENV.osName = toLower(get(window, 'ENV.Detected.os.name'))
    window.ENV.osVersion = toLower(get(window, 'ENV.Detected.os.version.original'))
    window.ENV.systemInfo = window.ENV.osName + ':' + window.ENV.osVersion
  }

  componentWillMount() {
    let loadInfo = true;
    for(let i = 0; i < notLoadInfoUrls.length; i++) {
      let url = notLoadInfoUrls[ i ];
      if(url.indexOf(window.location.pathname) !== -1) {
        loadInfo = false;
        break;
      }
    }
    if(loadInfo) {
      pget('/rise/customer/info').then(res => {
        if(res.code === 200) {
          window.ENV.userName = res.msg.nickname
          window.ENV.headImgUrl = res.msg.headimgurl
          window.ENV.riseId = res.msg.riseId;
          window.ENV.className = res.msg.className;
          window.ENV.groupId = res.msg.groupId;
          window.ENV.roleName = res.msg.roleName;
          window.ENV.isAsst = res.msg.isAsst;
        }

        sa.init({
          name: 'sa',
          web_url: `https://quanwai.cloud.sensorsdata.cn/?project=${window.ENV.sensorsProject}`,
          server_url: `https://quanwai.cloud.sensorsdata.cn:4006/sa?token=0a145b5e1c9814f4&project=${window.ENV.sensorsProject}`,
          heatmap: {},
          is_single_page: true,
        });
        if(!!res.msg.riseId) {
          sa.login(res.msg.riseId);
        }
        let props = { roleName: window.ENV.roleName, isAsst: window.ENV.isAsst };
        if(!!window.ENV.className && !!window.ENV.groupId) {
          merge(props, {
            className: window.ENV.className,
            groupId: window.ENV.groupId
          });
        }
        sa.registerPage(props);
        sa.quick('autoTrack');

        this.setState({ showPage: true })
      })
    } else {
      this.setState({ showPage: true })
    }
  }

  componentDidMount() {
    config([ 'chooseWXPay' ])
  }

  closeAnswer() {
    const { dispatch } = this.props
    dispatch(set(SHOW_MODAL_KEY, false))
  }

  render() {
    if(!this.state.showPage) {
      return <div></div>
    }

    return (
      <div>
        {this.props.children}
        <Toast show={isPending(this.props, LOAD_KEY)} icon="loading">
          <div style={{ fontSize: 12, marginTop: -4 }}>加载中...</div>
        </Toast>
        <Dialog {...this.state.alert}
                show={this.props.base.showModal}>
          <pre className="global-pre">{this.props.base.alertMsg}</pre>
        </Dialog>
      </div>
    )
  }
}
