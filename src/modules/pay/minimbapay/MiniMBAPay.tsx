import React, { Component } from 'react';
import { connect } from 'react-redux';
import { pay } from '../../helpers/JsConfig'
import './MiniMBAPay.less'
import { set, startLoad, endLoad, alertMsg } from 'redux/actions'
import { refreshForPay, sa } from '../../../utils/helpers'
import { addUserRecommendation } from '../risepay/async'
import { getRiseMember } from '../async'

/**
 * 商业进阶课售卖页
 */
@connect(state => state)
export default class PlusPay extends Component<any, any> {
  constructor() {
    super();
    this.state = {
      showId: 8,
    };
  }

  async componentWillMount() {
    if(refreshForPay()) {
      return;
    }
    const id = this.props.location.query.riseId
    //表示是分享点击进入
    const { dispatch } = this.props;
    dispatch(startLoad());
    let res = await getRiseMember(this.state.showId)
    dispatch(endLoad());
    if(res.code === 200) {
      const { privilege, memberType, tip, buttonStr, auditionStr, remainHour, remainMinute } = res.msg;
      this.setState({ privilege, memberType, tip, buttonStr, auditionStr, remainHour, remainMinute })
      // 进行打点
      if(privilege) {
        sa.track('openSalePayPage', {
          goodsType: getGoodsType(this.state.showId),
          goodsId: this.state.showId + ''
        });
        mark({ module: '打点', function: '进阶课程', action: '购买进阶课程会员', memo: '入学页面' })
      } else {
        sa.track('openSaleApplyPage', {
          goodsType: getGoodsType(this.state.showId),
          goodsId: this.state.showId + ''
        });
        mark({ module: '打点', function: '进阶课程', action: '购买进阶课程会员', memo: '申请页面' })
      }
    }
  }

  render() {
    const { privilege, memberType, tip, buttonStr, auditionStr, remainHour, remainMinute } = this.state;
    const renderPay = () => {
      if(typeof(privilege) === 'undefined') {
        return null;
      }
      if(!!privilege) {
        return <FooterButton btnArray={[
          {
            click: () => this.goApplySubmitPage(),
            text: '立即入学',
            module: '打点',
            func: '',
            action: '',
            memo: ''
          }
        ]}/>
      } else {
        return <FooterButton btnArray={[
          {
            click: () => this.goApplySubmitPage(),
            text: '马上预约',
            module: '',
            func: '',
            action: '',
            memo: ''
          }
        ]}/>
      }
    }

    return (
      <div className="plus-pay">
        {renderPay()}

      </div>
    )
  }
}
