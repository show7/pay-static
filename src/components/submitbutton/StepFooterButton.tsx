import * as React from 'react'
import './StepFooterButton.less';
import Icon from '../Icon'

export class StepFooterButton extends React.Component<any, any> {
  constructor() {
    super();
  }

  componentDidMount() {

  }

  render() {
    const { goods, name, clickText = '立即报名', onClick = () => {} } = this.props;
    if(goods && goods.stepPrice) {
      return (
        <div className="step-button-wrapper">
          <div className="top-tips">
            <div className="remain-tips">
              <Icon size={12} type="timeicon"/>&nbsp;&nbsp;本档剩余：{goods.remain}个名额
            </div>
            <div className="tips-split"/>
            <div className="raise-tips">
              即将涨价：￥{goods.nextPrice}
            </div>
          </div>
          <div className={`step-footer-button-component step-price ${name}`}>
            <div className="fee-area">
              <span className="fee-icon">￥</span>
              <span className="fee">{goods.fee}</span>
              <span className="old-fee">原价￥{goods.initPrice}</span>
            </div>
            <div className="button-click-area" onClick={() => onClick()}>
              &nbsp;{clickText}&nbsp;>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className={`step-footer-button-component normal ${name}`}>
          <div className="button-click-area" onClick={() => onClick()}>
            <div className="btn-text">
              <div className="fee-wrapper">
                <span className="fee-icon">￥</span><span className="fee">{goods.fee}</span>
              </div>
              &nbsp;{clickText}&nbsp;>
            </div>
          </div>
        </div>
      )
    }
  }
}