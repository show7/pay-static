import * as React from 'react'
import './SaleBody.less'
import { set, startLoad, endLoad, alertMsg } from 'redux/actions'
import { CustomerEvaluate } from './CustomerEvaluate'
import { unScrollToBorder } from '../../../../utils/helpers'

export class SaleBody extends React.Component {

  constructor() {
    super()
  }

  componentDidMount() {
    unScrollToBorder('#business-school-intro-pic-container')
  }

  render() {
    const { loading } = this.props
    return (
      <div className="business-school-intro-pic-container" id="business-school-intro-pic-container">
        <img
          className="pic-part1"
          src="https://static.iqycamp.com/images/pay_rise_part1_6.png?imageslim"
          style={{ width: '100%' }}
          onLoad={() => this.setState({ loading: false })}/>
        {
          loading ? null : <CustomerEvaluate/>
        }
        <img
          className="pic-part2"
          src="https://static.iqycamp.com/images/pay_rise_part2_3.png?imageslim"
          style={{ width: '100%' }}
        />
        {
          loading ?
            <div className="pic-loading-container">
              <img src="https://static.iqycamp.com/images/loading_page2.gif" className="loading-pic"
                   style={{ 'width': 300, 'display': 'block', 'margin': '0 auto' }}/>
            </div> : null
        }
      </div>
    )
  }

}