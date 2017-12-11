import * as React from 'react'
import './FooterButton.less'

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
    const { btnArray = [] } = this.props
    if(btnArray.length === 1) {
      const { click, text } = btnArray[ 0 ];
      return (
        <div className="ft-button-wrapper button-footer">
          <div className="submit-btn" onClick={() => click()}>{text}</div>
        </div>
      )
    } else {
      //if(btnArray.length === 2)
      return (
        <div className="ft-button-wrapper button-footer two-buttons">
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
