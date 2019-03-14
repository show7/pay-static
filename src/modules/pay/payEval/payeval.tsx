import * as React from "react";
import "./payeval.less";
import { connect } from "react-redux";
import { PayType, sa, refreshForPay, saTrack } from 'utils/helpers'
import { set, startLoad, endLoad, alertMsg } from 'redux/actions'
import { FooterButton } from "../../../components/submitbutton/FooterButton";
import AssetImg from "../../../components/AssetImg";
import RenderInBody from "../../../components/RenderInBody";
import { mark } from "../../../utils/request";
import {Button} from  "../../../components/button/button"
import PayInfo from '../components/PayInfo'
import { config, configShare } from 'modules/helpers/JsConfig'
import { checkRiseMember, getRiseMember,courseBuyValidate, loadInvitation, loadTask } from '../async'

@connect(state => state)
export default class SelfInit extends React.Component<any, any> {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor() {
    super();
    this.state = {
      list: [ 1, 2 ],
      fiexdBuyButton:false,
      goodsId:26,
      goodsInfo:{},
      pageIsShow:false,
      tip:'9.9',
    };
  }
  componentDidMount(){
      window.addEventListener("scroll",this.setBuyButtonShow.bind(this))
  }
  componentWillUnmount(){
      window.removeEventListener("scroll",this.setBuyButtonShow.bind(this))
  }
  setBuyButtonShow() {

    var scroll_top = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
        scroll_top = document.documentElement.scrollTop;
    }
    else if (document.body) {
        scroll_top = document.body.scrollTop;
    }
    const buyButtonOffsetTop = 
        document.getElementsByClassName("buy-button")[0].offsetTop 
        +document.getElementsByClassName("buy-button")[0].offsetHeight
        this.setState({
            fiexdBuyButton:(scroll_top>buyButtonOffsetTop)
        })
        

}
async componentWillMount(){
    const { dispatch } = this.props
    try{
        const { msg } = await courseBuyValidate()
        const { paid, submit, submitId }= msg
        this.setState({
            pageIsShow: !( paid || submit )
        })
        // 提交过跳转结果页面&&&购买过跳转评测页面
        if(submit){
            window.location.replace(`/rise/activity/static/guest/value/evaluation/self/complete?selfSubmitId=${submitId}`)
        }else if(paid){
            window.location.replace("/rise/activity/static/guest/value/evaluation/self/question")
        }
    }catch(error){
        dispatch(alertMsg(error))
    }
    
    // ios／安卓微信支付兼容性
    if(refreshForPay()) {
        return
      }
    const { goodsId } = this.state
    getRiseMember(goodsId).then(res => {
        console.log(res)
        if(res.code === 200) {
            this.setState({ goodsInfo: res.msg })
        }
    })
}
 /**
   * 重新注册页面签名
   */
  reConfig() {
    config([ 'chooseWXPay' ])
  }

/**
   * 打开支付窗口
   * @param goodsId 会员类型id
   */
  handleClickOpenPayInfo(goodsId) {
    const { dispatch } = this.props
    const { goodsInfo } = this.state
    const { privilege, errorMsg } = goodsInfo
    if(!privilege && !!errorMsg) {
      dispatch(alertMsg(errorMsg))
      return
    }
    const { riseId = '', type = 0 } = this.props

    this.reConfig()
    dispatch(startLoad())
    // 先检查是否能够支付
    checkRiseMember(goodsId, riseId, type).then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
          console.log(res.msg)
        const { qrCode, privilege, errorMsg, subscribe } = res.msg
        if(subscribe) {
          if(privilege) {
            console.log('可以支付',this.refs.payInfo,this.refs.payInfo.handleClickOpen);
            this.refs.payInfo.handleClickOpen()
          } else {
            dispatch(alertMsg(errorMsg))
          }
        } else {
          this.setState({ qrCode: qrCode, showQr: true })
        }
      }
      else {
        dispatch(alertMsg(res.msg))
      }
    }).catch(ex => {
      dispatch(endLoad())
      dispatch(alertMsg(ex))
    })
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

  handlePayedDone() {
    const { goodsInfo } = this.state
    const { quanwaiGoods = {} } = goodsInfo
    mark({ module: '打点', function: '测评售卖课购买', action: '支付成功', memo: quanwaiGoods.id })
    window.location.replace("/rise/activity/static/guest/value/evaluation/self/question")
  }

  render() {
    const { showQrCode,pageIsShow,fiexdBuyButton,goodsId, qrCode,tip,goodsInfo } = this.state;
    const { quanwaiGoods={} } = goodsInfo
    return (
        pageIsShow && <div className="self-init-component">
            <div>
                {/*<-- 头图 -->*/}
                <AssetImg url='https://static.iqycamp.com/banner-as4kx76a.png' width='100%'/>
                <section className="self-init-container">
                <h2 className="self-init-title">职业发展潜能测评</h2>
                <div className="self-init-title-tips">
                    了解你的职场核心竞争力
                </div>
                <div className="self-init-price">
                    ￥{tip} <span className='price-delete'>￥99</span>
                </div>
                <div className="buy-button">
                    <Button str="立即购买" callback={()=> this.handleClickOpenPayInfo(goodsId)} />
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
                <AssetImg url='https://static.iqycamp.com/tree-esjik4i4.png' width='100%'
                            style={{ display: 'block', margin: '0 auto', padding: '3rem 0 0rem 0' }}/>



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
                    <span className='text'>用户评价</span>
                    </span>
                </h4>
                <div className="user-satisfaction-wrap">
                    <div>
                        <AssetImg url='https://static.iqycamp.com/avartor-v052od1u.png'
                            style={{ display: 'block'}}/>
                        <div>
                            <h1>月半小王瑞</h1>
                            <div className="user-comment-times">发布时间：05月20日</div>
                            <div className="user-comment-text"><span className="top-quotation-marks">“</span>在班级群里，回答大家的问题，收获了教练大大和圈柚们的认可。连我自己也吃惊于自己的进步！<span className="top-quotation-marks">”</span></div>
                        </div>
                    </div>
                    <div>
                        <AssetImg url='https://static.iqycamp.com/avartor-v052od1u.png'
                            style={{ display: 'block'}}/>
                        <div>
                            <h1>月半小王瑞</h1>
                            <div className="user-comment-times">发布时间：05月20日</div>
                            <div className="user-comment-text"><span className="top-quotation-marks">“</span>在班级群里，回答大家的问题，收获了教练大大和圈柚们的认可。连我自己也吃惊于自己的进步！<span className="top-quotation-marks">”</span></div>
                        </div>
                    </div>
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
                
                </span>
                {/* <div style={{ width: '100%', height: '4.5rem' }}/> */}
                
                
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
            <div>
            {
            fiexdBuyButton?
                <div className="fiexd-buy-button">
                <FooterButton wrapperClassName='primary' btnArray={[ {
                    click: () => this.handleClickOpenPayInfo(goodsId), text: `¥ ${tip} 限时购买`} ]}/>
                </div>:''
            }
            </div>
            <div>
            {   quanwaiGoods &&
                <PayInfo
                    ref="payInfo"
                    dispatch={this.props.dispatch}
                    goodsType={quanwaiGoods.goodsType}
                    goodsId={quanwaiGoods.id}
                    header={quanwaiGoods.name}
                    priceTips={tip}
                    payedDone={(goodsId) => this.handlePayedDone(goodsId)}
                    payedCancel={()=>{}}
                    payedError={(res) => {}}
                    payedBefore={() => {}}
                    payType={PayType.WECHAT}/>
            }
            </div>
        </div>
    );
  }

}
