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
import { signupCamp, createCampGroup, getCampPageInfo } from './async'
import { CustomerService } from '../../../components/customerservice/CustomerService'
import { MarkBlock } from '../components/markblock/MarkBlock'
import { SubmitButton } from '../../../components/submitbutton/SubmitButton'
import Icon from '../../../components/Icon'

@connect(state => state)
export default class CampPayGuest extends React.Component<any, any> {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor() {
    super()
    this.state = {
      loading: true,
    }
  }

  async componentWillMount() {
    const { dispatch } = this.props
    dispatch(startLoad())
    let res = await getCampPageInfo();
    dispatch(endLoad())
    if(res.code === 200) {
      this.setState(res.msg);
      mark({ module: '打点', function: '小课训练营-未关注', action: '购买小课训练营', memo: _.get(res, 'msg.markSellingMemo', 'error') })
    } else {
      dispatch(alertMsg(res.msg))
    }
  }

  handleClickOpenPayInfo() {
    let _fk = _.get(this.props.location, 'query._fk');
    if(!_fk) {
      // 如果没有获取fk，则取默认fk
      _fk = 'camp_guest';
    }
    window.location.href = `/pay/camp?_fk=${_fk}`;
  }

  render() {
    const { campPaymentImage, markSellingMemo, loading,currentCampMonth } = this.state

    const renderPay = () => {
      return (
        <div className="pay-page">
          <img className="sale-pic" style={{ width: '100%' }}
               src={campPaymentImage}
               onLoad={() => {
                 this.setState({ loading: false })
               }}/>
          {

            <div className="button-footer">
              <MarkBlock module={'打点'} func={'小课训练营-未关注'}
                         action={'点击加入按钮'} memo={currentCampMonth}>
                <SubmitButton clickFunc={() => this.handleClickOpenPayInfo()} buttonText={'加入专项课'}/>
              </MarkBlock>
            </div>
          }
        </div>
      )
    }

    const renderKefu = () => {
      return (
        <CustomerService/>
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
