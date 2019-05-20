import React, {
  Component
} from 'react'

import './Popup.less'

export default class Popup extends Component {
  constructor (props) {
    super(props)
  }

  /*
   * hidePoup () {
   *   this.props.changePhone(false)
   * }
   */

  render () {
    const {
      isShow,
      closePopup
    } = this.props

    return (
<div className="popup-component-wrap"
     style={{ display: isShow ? 'flex' : 'none' }}>
      <div className="popup-content animation-popup"> {
        this.props.children
      } <img className="popup-close-btn"
             src="https://static.iqycamp.com/close-cb7lyr2s.png"
             onClick={() => closePopup()}/>
      </div>
</div>
    )
  }
}
