import React, { Component } from 'react';
import { connect } from 'react-redux';
import { pay } from '../../helpers/JsConfig'
import './MiniMBAPay.less'
import { refreshForPay } from '../../../utils/helpers'
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
      showId: 3,
    };
  }

  async componentWillMount() {
    if(refreshForPay()) {
      return;
    }
    const id = this.props.location.query.riseId
    //表示是分享点击进入
    let res = await getRiseMember(this.state.showId)
    if(res.code === 200) {
      const { privilege, memberType, tip, buttonStr, auditionStr, remainHour, remainMinute } = res.msg;
      this.setState({ privilege, memberType, tip, buttonStr, auditionStr, remainHour, remainMinute })
      if(privilege) {
        sa.track('openSalePayPage', {
          goodsType: getGoodsType(3),
          goodsId: '3'
        });
        mark(
          { module: '打点', function: '商学院会员', action: '购买商学院会员', memo: '入学页面' })
      } else {
        sa.track('openSaleApplyPage', {
          goodsType: getGoodsType(3),
          goodsId: '3'
        });
        mark(
          { module: '打点', function: '商学院会员', action: '购买商学院会员', memo: '申请页面' })
      }
    }
  }

  render() {
    return (
      <div className="plus-pay">

      </div>
    )
  }
}
