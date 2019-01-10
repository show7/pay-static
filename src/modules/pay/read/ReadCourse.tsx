import * as React from "react";
import "./ReadCourse.less";
import { connect } from "react-redux";
import { loadActivityCheck, autoJoinReadCourse } from '../async'
import { alertMsg } from "../../../redux/actions";
import { mark } from 'utils/request'
import { Dialog } from 'react-weui'

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
      msg : ''
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
    mark({ module: '打点', function: '阅读课入学', action: '自动开课' })
    autoJoinReadCourse().then(res => {
      this.setState({msg: res.msg, show: true})
    })

  }

  render() {
    const {
      saleImg,
      show,
      msg
    } = this.state
    return (
      <div className='read-course-container'>
        {
          saleImg && saleImg.map((item, index) => {
            return <img key={index} src={item} alt=""/>
          })
        }

        <Dialog show={show} buttons={[
            {
              label: '去上课', onClick: () => {
                window.location.href = '/rise/static/learn';
              }
            }
          ]}>
          {msg}
        </Dialog>

        <div className="bottom-button">
          <ul>
            <li style={{ width:'100%',
            background: "rgba(61,81,137,1)",
            color:"rgba(255,255,255,1)" }} onClick={()=>{this.handleFreeEntry()}}>点击开课
            </li>
          </ul>
        </div>

      </div>
    )
  }
}
