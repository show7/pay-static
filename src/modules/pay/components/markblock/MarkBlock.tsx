import * as React from 'react'
import { mark } from '../../../../utils/request'

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

  handleClickMarkBlock(onClickFunc) {
    const { module, func, action, memo = '' } = this.state
    let param = {
      module: module,
      function: func,
      action: action,
      memo: memo
    }
    mark(param).then(res => {
      if(res.code === 200) {
        onClickFunc()
      } else {
        console.error(res.msg)
      }
    }).catch(er => console.error(er))
  }

  render() {
    const { onClick = () => {} } = this.props

    return (
      <div {...this.props}
           onClick={() => {
             this.handleClickMarkBlock(onClick)
           }}>
        {this.props.children}
      </div>
    )
  }

}
