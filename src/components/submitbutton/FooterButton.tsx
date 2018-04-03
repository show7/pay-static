import * as React from 'react'
import './FooterButton.less'
import classnames from 'classnames';

interface SubmitButtonProps {
  btnArray: any,
}

interface SubmitButtonState {

}

export class FooterButton extends React.Component<SubmitButtonProps, SubmitButtonState> {

  constructor() {
    super()
  }

  render() {
    const { btnArray = [], primary = false, second = false } = this.props
    if(btnArray.length === 1) {
      const { click, text } = btnArray[ 0 ];
      return (
        <div className={classnames('ft-button-wrapper', 'button-footer-component', {
          'primary': primary,
          'second': second
        })}>
          <div className="submit-btn" onClick={() => click()}>{text}</div>
        </div>
      )
    } else {
      //if(btnArray.length === 2)
      return (
        <div className={classnames('ft-button-wrapper', 'button-footer-component', 'two-buttons', {
          'primary': primary,
          'second': second
        })}>
          {btnArray.map((btn, idx) => {
            const { click, text } = btn;
            return (
              <div className="button" key={idx} onClick={() => click()}>
                {text}
              </div>
            )
          })}
        </div>
      )
    }
  }

}
