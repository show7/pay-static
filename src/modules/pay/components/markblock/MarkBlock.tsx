import * as React from 'react'
import { mark } from 'utils/request'

interface MarkBlockProps {
  module: string,
  func: string,
  action: string,
  memo?: string
}

export class MarkBlock extends React.Component<MarkBlockProps, any> {

  constructor() {
    super()
  }

  state = {}

  componentWillMount() {
    this.initParams()
  }

  initParams() {
    const { module, func, action, memo = '' } = this.props
    this.setState({
      module: module,
      func: func,
      action: action,
      memo: memo
    })
  }

  async handleClickMarkBlock(onClickFunc) {
    const { module, func, action, memo = '' } = this.state
    let param = {
      module: module,
      function: func,
      action: action,
      memo: memo
    }
    let res = await mark(param)
    if(res.code === 200) {
      console.log('onClickFunc',onClickFunc)
      onClickFunc()
    } else {
      console.error(res.msg)
    }
  }

  render() {
    const { module, func, action, memo, onClick = () => {}, ...other } = this.props

    return (
      <div {...other}
           onClick={() => {
             this.handleClickMarkBlock(onClick)
           }}>
        {this.props.children}
      </div>
    )
  }

}
