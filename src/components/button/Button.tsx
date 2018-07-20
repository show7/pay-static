import React, { Component } from 'react';
import './Button.less'

export class Button extends Component {
  constructor() {
    super();
    this.state = {}
  }

  render() {
    const {
      str,
      callback = () => {}
    } = this.props;
    return (
      <div className="button-component" onClick={() => callback()}>
        {str}
      </div>
    )
  }

}
Button.propTypes = {
  str: React.PropTypes.string,
  callback: React.PropTypes.func,
}