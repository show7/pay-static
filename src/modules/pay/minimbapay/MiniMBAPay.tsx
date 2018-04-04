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
      this.setState({

      })
    }

  }

  render() {
    return (
      <div className="plus-pay">

      </div>
    )
  }
}
