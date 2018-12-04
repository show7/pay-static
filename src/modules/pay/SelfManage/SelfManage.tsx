
import * as React from "react";
import "./SelfManage.less";
import { connect } from "react-redux";
import {loadActivityCheck,loadPoster} from '../async'
import PayInfo from "../components/PayInfo";
import {PayType} from "../../../utils/helpers";
import {mark} from "../../../utils/request";
import * as _ from "lodash";
import {alertMsg} from "../../../redux/actions";
import {configShare} from "../../helpers/JsConfig";


@connect(state => state)
export default class SelfManage extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state= {
      isCanBuy: true,
      isSubscribe: false,
      price: 49,
      qrCodeUrl: "",
      saleImg: null,
      content: '',
      posterUrl: '',
      posterShow:false,
      subscribe:false,
      needMember:0
    }
  }

  componentWillMount(){
    this.getInfo();
    this.getLoadPoster();
    configShare(
      `【圈外同学】请停止无效努力音频课`,
      `https://${window.location.hostname}/pay/selfmanage?riseId=${window.ENV.riseId}`,
      'https://static.iqycamp.com/71527579350_-ze3vlyrx.pic_hd.jpg',
      `顶尖咨询总监，8年职场方法论`,
    )
  }

  getInfo(){
    const { riseId=null } = this.props.location.query
    let param = riseId ? Object.assign({},{riseId:riseId}):{};
    loadActivityCheck(param).then((res)=>{
      if (res.code === 200){
        let result = res.msg;
        this.setState({
          isCanBuy: result.isCanBuy,
          isSubscribe: result.isSubscribe,
          price: result.price,
          qrCodeUrl: result.qrCodeUrl,
          goodsId:result.goodsId,
          goodsName:result.goodsName,
          goodsType:result.goodsType,
          saleImg:result.saleImg,
          needMember:result.needMember
        })
        if (!result.isSubscribe) {
          this.setState({
            subscribe: true
          })
        }
      }
    })
  }

  getLoadPoster(){
    let param = {activityId:13};
    loadPoster(param).then((res)=>{
      if (res.code===200){
        let result = res.msg
        this.setState({
          content:result.content,
          posterUrl:result.url
        })
      }
    })
  }

  handlePayedDone() {
    mark({module: '打点', function: '自我管理专项课', action: '支付成功'})
    const {dispatch} = this.props
    dispatch(alertMsg('支付成功'))
  }

  /** 处理取消支付的状态 */
  handlePayedCancel(res) {
    const {dispatch} = this.props
    dispatch(alertMsg('已取消支付'))
  }

  /** 处理支付失败的状态 */
  handlePayedError(res) {
    const {dispatch} = this.props
    dispatch(alertMsg('支付失败'))
  }

  handlePayedBefore() {
    mark({module: '打点', function: '进阶课程', action: '点击付费'})
  }

  /*点击购买*/
  handlePayPopOut(){
    const {isSubscribe,isCanBuy} = this.state;
    const {dispatch} = this.props
    if (isSubscribe) {
      this.refs.payInfo.handleClickOpen()
    }else {
      this.setState({
        subscribe:true
      })
    }
  }

  /**
   * 海报展示
   */
  handleShowPoster(){
    const {isSubscribe,isCanBuy} = this.state;
    if (isSubscribe) {
      this.setState({
        posterShow:true,
      })
    }else {
      this.setState({
        subscribe:true
      })
    }

  }
  render(){
    const {
      price,
      qrCodeUrl,
      saleImg,
      goodsId,
      goodsName,
      goodsType,
      posterShow,
      content,
      posterUrl,
      subscribe,
      needMember
    } = this.state
    return (
      <div className='self-manage-container'>
        {
          saleImg && saleImg.map((item,index)=>{
            return <img key={index}  src={item} alt=""/>
          })
        }
        {
          goodsId &&
          <PayInfo ref="payInfo" dispatch={this.props.dispatch} goodsType={goodsType}
                   goodsId={goodsId} header={goodsName} priceTips={} activityId={13}
                   payedDone={(goodsId) => this.handlePayedDone()}
                   payedCancel={(res) => this.handlePayedCancel(res)}
                   payedError={(res) => this.handlePayedError(res)}
                   payedBefore={() => this.handlePayedBefore()}
                   payType={ PayType.WECHAT}/>
        }
        <div className="bottom-button">
          <ul>
            <li onClick={()=>{this.handlePayPopOut()}}>{price}元付费入学</li>
            <li onClick={()=>{this.handleShowPoster()}}>免费入学</li>
          </ul>
        </div>
        {
          posterShow && posterUrl &&
          <div className="poster-mask">
            <div className="poster-box">
              <p>转发海报，{needMember}个好友扫码，免费入学</p>
              <img className='close'
                   onClick={()=>{this.setState({ posterShow:false,})}}
                   src="https://static.iqycamp.com/close-2-t6urec58.png" alt=""/>
              <img className='posterPic' src={posterUrl+'?imageslim'} alt=""/>
            </div>
          </div>
        }

        {
          subscribe && qrCodeUrl &&
          <div className="subscribe-mask">
            <div className="qrCodeUrl-box">
              <p>请先扫码关注，“圈外同学”公众号，了解报名详情👇</p>
              <img  className='subscribe' src={qrCodeUrl} alt=""/>
              <img className='close'
                   onClick={()=>{this.setState({ subscribe:false,})}}
                   src="https://static.iqycamp.com/close-2-t6urec58.png" alt=""/>
            </div>
          </div>
        }

      </div>
    )
  }
}
