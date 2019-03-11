import * as React from "react";
import "./payeval.less";
import { connect } from "react-redux";
import { FooterButton } from "../../../components/submitbutton/FooterButton";
import AssetImg from "../../../components/AssetImg";
import RenderInBody from "../../../components/RenderInBody";
import { mark } from "../../../utils/request";
import {Button} from  "../../../components/button/button"
import $ from "../../../utils/jquery-1.11.0.min"
import "../../../utils/circleChart.min.js"

@connect(state => state)
export default class SelfInit extends React.Component<any, any> {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor() {
    super();
    this.state = {
      list: [ 1, 2 ],
      userSatisfaction: [
            {
                press:40,
                type:"平均",
                title:"题目异动性"
            },
            {
                press:40,
                type:"平均",
                title:"题目异动性"
            },
            {
                press:40,
                type:"平均",
                title:"题目异动性"
            }
        ]
    };
  }
  componentDidMount(){
      this.drawCavans()
  }
  handleClickStart() {
    const { subscribe } = this.state;
    if(!!subscribe) {
      mark({
        module: "打点",
        function: "价值观测评",
        action: "点击开始",
        memo: "已关注"
      });
      this.context.router.push({
        pathname: "/rise/activity/static/guest/value/evaluation/self/question"
      });
    } else {
      mark({
        module: "打点",
        function: "价值观测评",
        action: "点击开始",
        memo: "未关注"
      });
      this.setState({ showQrCode: true });
    }
  }

  closeCode() {
    this.setState({ showQrCode: false });
  }
  drawCavans(){
      this.state.userSatisfaction.forEach((item,i) => {
        $(`.circleChart#${i+1}`).circleChart({
            size: 100,
            value: 80,
            startAngle:-25,
			color: "#67ee3e",
			backgroundColor: "#e6e6e6",
            text: 0,
            onDraw: function(el, circle) {}
                

        })
      });
  }
  render() {
    const { showQrCode, qrCode, list } = this.state;
    return (
      <div className="self-init-component">
        {/*<-- 头图 -->*/}
        <AssetImg url='https://static.iqycamp.com/images/fragment/survey-head-0522.jpg' width='100%'/>
        <section className="self-init-container">
          <h2 className="self-init-title">职业发展潜能测评</h2>
          <div className="self-init-title-tips">
            了解你的职场核心竞争力
          </div>
          <div className="self-init-price">
            ￥9.9 <span className='price-delete'>￥99</span>
          </div>
          <div className="buy-button">
            <Button str="立即购买"/>
          </div>
          <div className="self-init-point-tips">
            <div className="point-tips first">
            <span className="tips-text">
              12项专业指标
            </span>
            </div>
            <div className="point-tips">
             <span className="tips-text">
               华师大研究组联合开发
             </span>
            </div>
            <div className="point-tips last">
            <span className="tips-text">
              自评+他评
            </span>
            </div>
          </div>
        </section>
        <div className="grey-block"/>

        <div className="self-init-container">
          <h4 className="self-init-block-title">
            <span className="block-title-text">
              <span className='text'>测评简介</span>
            </span>
          </h4>
          <div className="self-init-context">
            关于自己，你真的了解吗？<br/><br/>

            职场上，每个人都有自己的优势与不足：<br/>
            -可能你思维活跃脑洞大开，但是执行力不足；<br/>
            -可能你擅长逻辑分析，但是不喜欢和人打交道；<br/>
            -可能你管理能力出众，但又容易趋于保守；<br/><br/>

            要想发挥职场潜能，你需要对自己的能力做一次清晰盘点，并且有针对性地扬长补短。<br/><br/>

            所以<span className='high-line-text'>圈外同学</span>联合<span className='high-line-text'>华东师范大学教育教练研究组</span>，共同开发职业发展潜能测评，让你对自己有一个清晰的定位。<br/><br/>

            测评通过<span className='high-line-text'>4大模块、12项职业能力和心理品质</span>，全面评估你的职业发展潜能，帮助你制订个人能力提升的策略和计划。
          </div>
          <h4 className="self-init-block-title">
            <span className="block-title-text">
              <span className='text'>职业发展潜能模型</span>
            </span>
          </h4>
          <AssetImg url='https://static.iqycamp.com/step-qeey5w7m.png' width='70%'
                    style={{ display: 'block', margin: '0 auto', padding: '3rem 0 5rem' }}/>



          <h4 className="self-init-block-title">
            <span className="block-title-text">
              <span className='text'>专业报告样本</span>
            </span>
          </h4>
          <div className="self-init-context">
            <p>1、为确保我们能够为你提供准确的评估和发展建议，请按客观情况认真填写测评问卷，答题结束你将获得一份专业的测评报告；</p><br></br>
            <p>2、测评题数较多，可能需要几秒的加载时间，建议在稳定的网络环境里完成测评；</p><br></br>
            <p>3、测评结果会永久保留在圈外同学微信服务号里，可以随时进入查看。</p>
          </div>


          <h4 className="self-init-block-title">
            <span className="block-title-text">
              <span className='text'>测评须知</span>
            </span>
          </h4>
          <span className="self-init-context should-know">
        1、为确保我们能够为你提供准确的评估和发展建议，请按客观情况认真填写测评问卷，答题结束你将获得一份专业的测评报告；<br/><br/>

        2、测评题数较多，可能需要几秒的加载时间，建议在稳定的网络环境里完成测评；<br/><br/>

        3、测评结果会永久保留在圈外同学微信服务号里，可以随时进入查看。
        <h4 className="self-init-block-title">
            <span className="block-title-text">
              <span className='text'>用户评价</span>
            </span>
        </h4>
        <div className="user-satisfaction-wrap">
            {
                this.state.userSatisfaction.map((item,i)=>
                    <div className="user-satisfaction-item" key={i}>
                        <cavans className="circleChart" id={i} key={i}></cavans>
                        <div>{item.title}</div>
                    </div>
                )
            }
        </div>
        </span>
          <div style={{ width: '100%', height: '4.5rem' }}/>
          <FooterButton wrapperClassName='primary' btnArray={[ {
            click: () => this.handleClickStart(), text: '立即开始测评'
          } ]}/>
          {!!showQrCode ?
            <RenderInBody>
              <div className="qr_dialog">
                <div className="qr_dialog_mask" onClick={() => {
                  this.closeCode();
                }}>
                </div>
                <div className="qr_dialog_content">
                  <span>扫码后可进行测评哦</span>
                  <div className="qr_code">
                    <AssetImg url={qrCode}/>
                  </div>
                </div>
              </div>
            </RenderInBody> : null
          }
        </div>
      </div>
    );
  }

}
