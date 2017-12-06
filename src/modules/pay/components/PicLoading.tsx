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
      show: true
    }
  }

  componentWillReceiveProps(newProps){
    if(newProps.show === false){
      this.setState({show:false})
    }
  }

  render() {
    const { show } = this.state
    return (
      show ?
        <div className="pic-loading-container">
          <img src="http://static.iqycamp.com/images/dribz.gif" className="loading-pic"
               style={{"width":300,"display": "block", "margin": "0 auto"}}/>
        </div>: null
    )
  }
}
