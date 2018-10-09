import * as React from "react";
import "./CollegeAudioPay.less";
import { connect } from "react-redux";
import { checkRiseMember, getRiseMember } from '../async'
import PayInfo from "../components/PayInfo";
import { startLoad, endLoad, alertMsg } from 'redux/actions'
import { PayType } from "../../../utils/helpers";
import { mark } from "../../../utils/request";
import { alertMsg } from "../../../redux/actions";
import { configShare, config } from "../../helpers/JsConfig";
import { FooterButton } from '../../../components/submitbutton/FooterButton'

@connect(state => state)
export default class CollegeAudioPay extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      showQr: false,
      showClassMaster : false,
      price: 1,
      saleImg: null,
      goodsId: 18,
    }
  }

  componentWillMount() {
    this.getInfo();
  }

  getInfo() {
    getRiseMember(this.state.goodsId).then((res) => {
      if(res.code === 200) {
        const { quanwaiGoods = {} } = res.msg
        this.setState({
          price: quanwaiGoods.price,
          goodsName: quanwaiGoods.goodsName,
          goodsType: quanwaiGoods.goodsType,
          saleImg: quanwaiGoods.saleImg
        })
        mark({ module: '打点', function: quanwaiGoods.goodsType, action: quanwaiGoods.id, memo: '入学页面' })
      }
    })
  }

  handlePayedDone() {
    mark({ module: '打点', function: '大学生音频课', action: '支付成功' })
    const { dispatch } = this.props
    this.setState({
      showClassMaster: true
    })
  }

  /** 处理取消支付的状态 */
  handlePayedCancel(res) {
    const { dispatch } = this.props
    dispatch(alertMsg('已取消支付'))
  }

  /** 处理支付失败的状态 */
  handlePayedError(res) {
    const { dispatch } = this.props
    dispatch(alertMsg('支付失败'))
  }

  handlePayedBefore() {
    mark({ module: '打点', function: '大学生音频课', action: '点击付费' })
  }

  /*点击购买*/
  handleClickOpenPayInfo() {
    const { dispatch } = this.props
    const { riseId = '', type = 0 } = this.props.location.query

    this.reConfig()
    dispatch(startLoad())
    // 先检查是否能够支付
    checkRiseMember(this.state.goodsId, riseId, type).then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
        const { privilege, errorMsg, subscribe } = res.msg
        if(subscribe) {
          if(privilege) {
            this.refs.payInfo.handleClickOpen()
          } else {
            dispatch(alertMsg(errorMsg))
          }
        } else {
          this.setState({showQr: true })
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

  /**
   * 重新注册页面签名
   */
  reConfig() {
    config([ 'chooseWXPay' ])
  }

  render() {
    const {
      price,
      saleImg,
      goodsId,
      goodsName,
      goodsType,
      showQr,
      showClassMaster
    } = this.state
    return (
      <div className='pay-college-audio-container'>
        <img src={saleImg} alt=""/>
        {
          goodsId &&
          <PayInfo ref="payInfo" dispatch={this.props.dispatch} goodsType={goodsType}
                   goodsId={goodsId} header={goodsName} priceTips={}
                   payedDone={(goodsId) => this.handlePayedDone()}
                   payedCancel={(res) => this.handlePayedCancel(res)}
                   payedError={(res) => this.handlePayedError(res)}
                   payedBefore={() => this.handlePayedBefore()}
                   payType={ PayType.WECHAT}/>
        }
        <div className="bottom-button">
          <FooterButton className='college-audio' btnArray={[
          {
            click: () => this.handleClickOpenPayInfo(goodsId),
            text: '1元付款入学',
            module: '打点',
            func: goodsId,
            action: '点击入学按钮',
          }
        ]}/>
        </div>

        {
          showQr &&
          <div className="subscribe-mask">
            <div className="qrCodeUrl-box">
              <p>你还没有关注公众号，请先扫码关注哦！</p>
              <img className='subscribe' src="https://static.iqycamp.com/college_audio_u6ysw4ck-ubq63v11.jpg" alt=""/>
              <img className='close'
                   onClick={()=>{this.setState({ showQr:false})}}
                   src="https://static.iqycamp.com/close-2-t6urec58.png" alt=""/>
            </div>
          </div>
        }

        {
          showClassMaster &&
          <div className="subscribe-mask">
            <div className="qrCodeUrl-box">
              <p>付款成功，赶紧添加班主任吧！</p>
              <img className='subscribe' src="https://static.iqycamp.com/WechatIMG2035-3g46vcbv.jpeg" alt=""/>
            </div>
          </div>
        }

      </div>
    )
  }
}