import * as React from 'react'
import * as _ from 'lodash'
import './CampPay.less'
import { connect } from 'react-redux'
import { mark } from '../../../utils/request'
import { getGoodsType } from '../../../utils/helpers'
import { set, startLoad, endLoad, alertMsg } from '../../../redux/actions'
import { config, configShare } from '../../helpers/JsConfig'
import PayInfo from '../components/PayInfo'
import PicLoading from '../components/PicLoading'
import { getRiseMember, checkRiseMember } from '../async'
import { signupCamp, createCampGroup } from './async'
import { CustomerService } from '../../../components/customerservice/CustomerService'
import { MarkBlock } from '../components/markblock/MarkBlock'
import { SubmitButton } from '../../../components/submitbutton/SubmitButton'

@connect(state => state)
export default class CampPayGuest extends React.Component<any, any> {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor() {
    super()
    this.state = {}
  }

  async componentWillMount() {
    mark({ module: '打点', function: '小课训练营', action: '购买小课训练营', memo: _.get(res, 'msg.markSellingMemo', 'error') })
    const { dispatch } = this.props
    dispatch(startLoad())
    let res = await getCampPageInfo();
    if(res.code === 200) {
      this.setState(res.msg);
    } else {
      dispatch(alertMsg(res.msg))
    }
  }

  render() {
    const { data, showId, timeOut, showErr, showCodeErr, loading, show } = this.state
    const { memberType } = data

    const renderPay = () => {
      return (
        <div className="pay-page">
          <img className="sale-pic" style={{ width: '100%' }}
               src="https://static.iqycamp.com/images/fragment/camp_promotion_01_9.png?imageslim"
               onLoad={() => this.setState({ loading: false })}/>
          {
            <div className="button-footer">
              <MarkBlock module={'打点'} func={'小课训练营'}
                         action={'点击加入按钮'} memo={this.state.currentCampMonth}
                         className='footer-left' onClick={() => this.handleClickOpenPayInfo(showId)}>
                单人模式(¥498)
              </MarkBlock>
              <MarkBlock module={'打点'} func={'小课训练营'} action={'创建团队'}
                         className={'footer-btn'} onClick={() => this.handleGroup()}>
                互助模式（7天免费）
              </MarkBlock>
            </div>
          }
        </div>
      )
    }

    const renderKefu = () => {
      return (
        <CustomerService image="https://static.iqycamp.com/images/kefu.png?imageslim"/>
      )
    }

    return (
      <div className="camp-pay-container">
        <PicLoading show={loading}/>
        {renderPay()}
        {renderKefu()}
      </div>
    )
  }
}
