import React, { Component } from 'react'
import './Dialog.less'
export class Dialog extends Component {
  render() {
    const { text, btnText1, btnText2, callBack1, callBack2, show } = this.props
    return (
      <div>
        {show && (
          <div className="dialog-mask">
            <div className="dialog-content">
              <div className="dialog-text">{text}</div>
              <div className="dialog-button" onClick={() => callBack2()}>
                {btnText1}
              </div>
              <div className="dialog-button quiet" onClick={() => callBack1()}>
                {btnText2}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}
