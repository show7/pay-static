import React, {Component} from 'react'
import './FixedButton.less'

export default class FixedButton extends Component<any, any> {
  render() {
    const {buttonArray} = this.props
    return (
      <div className="fixed-button-component">
        <div>
          {buttonArray.map(btn => (
            <div style={{...btn.style}} onClick={btn.click}>
              {btn.text}
            </div>
          ))}
        </div>
      </div>
    )
  }
}
