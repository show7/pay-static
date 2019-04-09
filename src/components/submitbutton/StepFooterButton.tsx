import * as React from 'react'
import './StepFooterButton.less';

export class StepFooterButton extends React.Component<any,any> {
  constructor() {
    super();
  }

  componentDidMount() {

  }

  render() {
    const { goods,name } = this.props;
    console.log('goods', goods);
    if(goods && goods.stepPrice){
      return (
        <div className={`step-footer-button-component step-price ${name}`}>
          <div className="top-tips">

          </div>
          <div className="button-click-area">

          </div>
        </div>
      )
    } else {
      return (
        <div className={`step-footer-button-component normal ${name}`}>
          <div className="button-click-area">
            <div className="btn-text">
              <div className="fee-wrapper">
                <span className="fee-icon">￥</span><span className="fee">{goods.fee}</span>
              </div>
              &nbsp;立即报名&nbsp;>
            </div>
          </div>
        </div>
      )
    }
  }
}