import React, { Component } from 'react'
import './Alert.less'
export class Alert extends Component {
  render() {
    const { text, btnText, callBack, show } = this.props
    return (
      <div>
        {show && (
          <div className="alert-mask">
            <div className="alert-content">
              <div className="alert-text">{text}</div>
              <div className="alert-button" onClick={() => callBack()}>
                {btnText}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}
