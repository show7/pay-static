import * as React from 'react'

export default class PageNotFound extends React.Component {

  constructor () {
    super()
  }

  componentDidMount () {
    window.location.href = 'https://' + window.location.hostname + '/rise/static/home'
  }

  render () {
    return (
      <div></div>
    )
  }

}