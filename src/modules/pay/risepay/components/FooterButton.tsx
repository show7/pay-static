import * as React from 'react'
import './FooterButton.less'

interface FooterButtonProps {
  buttons: any
}

interface FooterButtonState {

}

export default class FooterButton extends React.Component<FooterButtonProps, FooterButtonState> {

  constructor() {
    super()
  }

  render() {
    const { buttons = [] } = this.props;
    console.log(buttons)
    return (
      <div className={`footer-button-component ${buttons && buttons.length > 1 ? 'two-buttons' : ''}`}>
        {buttons.map((button, key) => {
          return (
            <div key={key} className={`footer-button-item`} onClick={() => button.onClick()}>
              <span className={`footer-button-label ${button.icon ? button.icon : ''}`}
                    data-icon={button.icon}>{button.text}</span>
            </div>
          )
        })}
      </div>
    )
  }

}
