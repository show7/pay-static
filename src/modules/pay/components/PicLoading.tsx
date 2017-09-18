import * as React from "react";
import "./PicLoading.less"
import { Toast, Dialog } from "react-weui"

export default class PicLoading extends React.Component<any, any> {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <div className="pic-loading-container">
        <img src="https//static.iqycamp.com/images/loading_page2.gif" className="loading-pic"
             style={{"width":300,"display": "block", "margin": "0 auto"}}/>
      </div>
    )
  }
}
