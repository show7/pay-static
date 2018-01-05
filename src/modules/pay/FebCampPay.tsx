import * as React from 'react'
import * as _ from 'lodash'
import './FebCampPay.less'
import { connect } from 'react-redux'
import { set, startLoad, endLoad, alertMsg } from 'redux/actions'
import PicLoading from './components/PicLoading'
import { CustomerService } from '../../components/customerservice/CustomerService'
import { MarkBlock } from './components/markblock/MarkBlock'
import { appointFebCamp } from './async'

@connect(state => state)
export default class FebCampPay extends React.Component<any, any> {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor() {
    super()
    this.state = {
      showId: 5,
      timeOut: false,
      showErr: false,
      showCodeErr: false,
      loading: true,
      data: {}
    }
  }

  componentWillMount() {

  }

  handleAppointment() {
    const { dispatch } = this.props
    dispatch(alertMsg('预约成功'))
  }

  render() {
    const { loading } = this.state

    const renderPay = () => {
      return (
        <div className="pay-page">
          <img className="sale-pic" style={{ width: '100%' }}
               src="https://static.iqycamp.com/images/fragment/camp_promotion_01_8.png?imageslim"
               onLoad={() => this.setState({ loading: false })}/>
          <MarkBlock module={'打点'} func={'小课训练营'}
                     action={'点击预约按钮'} memo= "2月"
                     className='button-footer' onClick={() => this.handleAppointment()}>
            <div className="footer-btn">预约</div>
          </MarkBlock>
        </div>
      )
    }

    const renderKefu = () => {
      return (
        <CustomerService image="https://static.iqycamp.com/images/kefu.png?imageslim"/>
      )
    }

    return (
      <div className="feb-camp-pay-container">
        <PicLoading show={loading}/>
        {renderPay()}
        {renderKefu()}
      </div>
    )
  }
}
