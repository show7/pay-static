import React, { Component } from 'react';
import { connect } from 'react-redux';
import './MiniMBAPay.less'
import { set, startLoad, endLoad, alertMsg } from 'redux/actions'
import { getGoodsType, refreshForPay, sa } from '../../../utils/helpers'
import { getRiseMember } from '../async'
import { SaleBody } from '../risepay/components/SaleBody'
import { FooterButton } from '../../../components/submitbutton/FooterButton'
import { mark } from '../../../utils/request'

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

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  async componentWillMount() {
    if(refreshForPay()) {
      return;
    }
    //表示是分享点击进入
    let res = await getRiseMember(this.state.showId)
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

  redirect() {
    this.context.router.push({
      pathname: '/pay/bsstart',
      query: {
        project: 2
      }
    })
  }

  render() {
    const { privilege } = this.state;
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
            func: '进阶课程',
            action: '点击立即入学',
            memo: '入学页面'
          }
        ]}/>
      } else {
        return <FooterButton btnArray={[
          {
            click: () => this.redirect(),
            text: '马上预约',
            module: '打点',
            func: '进阶课程',
            action: '点击马上预约',
            memo: '申请页面'
          }
        ]}/>
      }
    }

    return (
      <div className="plus-pay">
        <SaleBody/>
        {renderPay()}

      </div>
    )
  }
}
