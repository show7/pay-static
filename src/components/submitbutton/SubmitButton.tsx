import * as React from 'react'
import './SubmitButton.less'

interface SubmitButtonProps {
  clickFunc: any,
  buttonText: string
}
interface SubmitButtonState {

}
export class SubmitButton extends React.Component<SubmitButtonProps, SubmitButtonState> {

  constructor() {
    super()
  }

  render() {
    const { clickFunc = () => {}, buttonText } = this.props

    return (
      <div className="submitbutton-component">
        <div className="submit-btn" onClick={() => clickFunc()}>{buttonText}</div>
      </div>
    )
  }

}
