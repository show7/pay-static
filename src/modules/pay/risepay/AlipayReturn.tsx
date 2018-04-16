import * as React from 'react'

export default class AlipayReturn extends React.Component<any, any> {

  constructor() {
    super()
    this.state = {}
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  render() {

    return (
      <div style={{
        fontSize: '20px',
        color: '#333',
        textAlign: 'center',
        marginTop: '40px'
      }}>
        您已支付成功，请返回微信查看
      </div>
    )
  }
}
