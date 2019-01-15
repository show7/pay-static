import * as React from "react";
import "./ReadCourse.less";
import { connect } from "react-redux";
import { loadActivityCheck, autoJoinReadCourse } from '../async'
import { alertMsg } from "../../../redux/actions";
import { mark } from 'utils/request'

@connect(state => state)
export default class ReadCourse extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      isCanBuy: true,
      isSubscribe: false,
      price: 49,
      qrCodeUrl: "",
      saleImg: null,
      content: '',
      posterUrl: '',
      posterShow: false,
      subscribe: false,
      needMember: 0,
      show: false,
      posterUrl: '',
    }
  }

  componentWillMount() {
    mark({ module: '打点', function: '阅读课入学', action: '进入页面' })
    this.getInfo()
  }

  getInfo() {
    const { riseId = null } = this.props.location.query
    let param = riseId ? Object.assign({}, { riseId: riseId }) : {};
    loadActivityCheck(5, param).then((res) => {
      if(res.code === 200) {
        let result = res.msg;
        this.setState({
          isCanBuy: result.isCanBuy,
          isSubscribe: result.isSubscribe,
          price: result.price,
          qrCodeUrl: result.qrCodeUrl,
          goodsId: result.goodsId,
          goodsName: result.goodsName,
          goodsType: result.goodsType,
          saleImg: result.saleImg,
          needMember: result.needMember
        })
      }
    })
  }

  /**
   * 点击免费入学
   */
  handleFreeEntry() {
    const { source = null } = this.props.location.query
    mark({ module: '打点', function: '阅读课入学', action: '自动开课' })
    autoJoinReadCourse(source).then(res => {
      this.setState({ posterUrl: res.msg, show: true })
    })

  }

  render() {
    const {
      saleImg,
      posterUrl,
      show
    } = this.state

    return (
      <div className='read-course-container'>
        {
          saleImg && saleImg.map((item, index) => {
            return <img key={index} src={item} alt=""/>
          })
        }

        {
          show && posterUrl &&
          <div className="poster-mask2">
            <div className="poster-box">
              <p>扫码添加班主任，才能正常开课！</p>
              <p>（不添加班主任无法开课）</p>
              <img className='posterPic' src={posterUrl} alt=""/>
              <img className='close'
                   onClick={() => {this.setState({ show: false })}}
                   src="https://static.iqycamp.com/close-2-t6urec58.png" alt=""/>
            </div>
          </div>
        }

        <div className="bottom-button">
          <ul>
            <li style={{ width:'100%',
            background: "rgba(61,81,137,1)",
            color:"rgba(255,255,255,1)" }} onClick={()=>{this.handleFreeEntry()}}>免费入学
            </li>
          </ul>
        </div>

      </div>
    )
  }
}
