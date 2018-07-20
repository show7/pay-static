import React, { Component } from 'react';
import './GreenDialog.less'
import { Button } from '../button/Button'
import Mask from '../mask/Mask'

export class GreenDialog extends Component {
  constructor() {
    super();
    this.state = {}
  }

  render() {
    const {
      title,
      content,
      btnStr,
      callback = () => {}
    } = this.props;
    return (
      <div className="green-dialog-component">
        <div className="dialog-main">
          <div className="dialog-header">
            <span className='dialog-header-title'>{title}</span>
          </div>
          <div className="dialog-body">
            <div className="dialog-content" dangerouslySetInnerHTML={{ __html: content }}>
            </div>
            <Button str={btnStr} callback={() => callback()}/>
          </div>
        </div>
        <Mask/>
      </div>
    )
  }
}