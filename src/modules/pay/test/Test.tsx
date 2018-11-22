import * as React from 'react'
import { connect } from 'react-redux'
import { loadAudioInfo } from '../async'

@connect(state => state)
export default class Test extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      saleImg: null,
      posterUrl: '',
      posterShow: false
    }
  }

  componentWillMount() {
    loadAudioInfo()
  }

  render() {
    return (
      <div>

      </div>
    )
  }
}
