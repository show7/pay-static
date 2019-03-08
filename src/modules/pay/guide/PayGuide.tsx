import * as React from 'react'
import AssetImg from '../../../components/AssetImg'
import { mark } from '../../../utils/request'
import { configShare } from 'modules/helpers/JsConfig'

import './PayGuide.less'
import { relative } from 'path';
import List from '../../../components/List/List'

export default class PayGuide extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  constructor () {
    super()
    this.state = {
      videoMaskShow: true,
      listArr: [
        {
          imgSrc: 'https://static.iqycamp.com/L1Img-w76rf049.png',
          title: '成为不可替代的超强个体',
          imgBg: 'https://static.iqycamp.com/L1bg-b0ksqwx2.png',
          timeTxt: '4个月课程',
          timeImg: 'https://static.iqycamp.com/time-5qkw5u7c.png',
          subtimeTxt: '',
          bittonTxt: '了解详情>'
        },
        {
          imgSrc: 'https://static.iqycamp.com/L2Img-1kzlil60.png',
          title: '成为有话语权的中坚力量',
          imgBg: 'https://static.iqycamp.com/L2bg-3z1xki1f.png',
          timeTxt: '5个月课程',
          timeImg: 'https://static.iqycamp.com/time-5qkw5u7c.png',
          subtimeTxt: '1个月实战',
          bittonTxt: '了解详情>'
        },
        {
          imgSrc: 'https://static.iqycamp.com/L3Img-vqam0n2l.png',
          title: '成为未来的商业领导者',
          imgBg: 'https://static.iqycamp.com/L3bg-e05fpehi.png',
          timeTxt: '6个月课程',
          timeImg: 'https://static.iqycamp.com/time-5qkw5u7c.png',
          subtimeTxt: '2个月实战',
          bittonTxt: '了解详情>'
        }
      ]
    }
  }

  async componentDidMount () {
    mark({ module: '打点', function: '售卖介绍页', action: '进入页面' })
    const {riseId} = this.props.location.query
    let targetRiseId
    if(riseId){
      targetRiseId = riseId
    } else{
      targetRiseId = window.ENV.riseId
    }

    configShare(
      `【圈外同学】职场提升计划`,
      `https://${window.location.hostname}/pay/guide?riseId=${targetRiseId}&type=2`,
      `https://static.iqycamp.com/71527579350_-ze3vlyrx.pic_hd.jpg`,
      `每天30分钟，开启你的职场进阶之旅`,
    )
  }

  handleClickGoL1 () {
    const {riseId} = this.props.location.query
    let targetRiseId;
    mark({ module: '打点', function: '售卖介绍页', action: '点击 L1' })
    if(riseId){
      targetRiseId = riseId
    } else{
      targetRiseId = window.ENV.riseId
    }
    window.location.href = `/pay/l1?riseId=${targetRiseId}&type=2`
  }

  handleClickGoL2 () {
    const {riseId} = this.props.location.query
    let targetRiseId;
    if(riseId){
      targetRiseId = riseId
    } else{
      targetRiseId = window.ENV.riseId
    }
    mark({ module: '打点', function: '售卖介绍页', action: '点击 L2' })

    window.location.href = `/pay/rise?riseId=${targetRiseId}&type=2`
  }

  handleClickGoL3 () {
    const {riseId} = this.props.location.query
    let targetRiseId;
    if(riseId){
      targetRiseId = riseId
    } else{
      targetRiseId = window.ENV.riseId
    }
    mark({ module: '打点', function: '售卖介绍页', action: '点击 L3' })
    window.location.href = `/pay/thought?riseId=${targetRiseId}&type=2`
  }
  handleClickGo (index) {
    if (index === 0) {
      this.handleClickGoL1()
    } else if (index === 1) {
      this.handleClickGoL2()
    } else if (index === 2) {
      this.handleClickGoL3()
    } else {
      return
    }
  }
  playVideo () {
    this.setState({
      videoMaskShow: false
    })
    let _video = document.querySelector('#quanwaiVideo');
    _video.setAttribute('controls', 'true');
    _video.play()
  }
  render () {
    const {} = this.state

    return (
      <div className="pay-guide-component">
        {/* <AssetImg className="guide-img"
                  url="https://static.iqycamp.com/complex-guide-back-wpwp7y33.jpg"/> */}
        <header>
          <div className="topic"><img src="https://static.iqycamp.com/quanwai-avf9km51.png" className="topicImg" /></div>
          <img className="guide-img" src="https://static.iqycamp.com/header-403g6r2q.png" />
        </header>
        <section>
        <ul className="listContent">
          {
            this.state.listArr.map((item, index) =>
            <li className="listItem">
            <img className="listBg" src={item.imgBg} />
            <div className="listCont">
              <div style={{flex: 1,paddingLeft:"10px"}}>
                <div className="listTit">{item.title}</div>
                <div className="timeCont"><img className="timeImg" src={item.timeImg} /><div>{item.timeTxt}<span className="moreTxt">{item.subtimeTxt === '' ? '' : `+${item.subtimeTxt}`}</span></div></div>
                <div className="more"><span onClick={() => this.handleClickGo(index)}>{item.bittonTxt}</span></div>
              </div>
              <div className="Listimg" style={{backgroundImage: `url(${item.imgSrc})`}}></div>
            </div>
          </li>)
          }
        </ul>
        </section>
        <footer>
          <div style={{position:"relative"}}>
            <img className="arrow" src="https://static.iqycamp.com/bootomImg-cws44aut.png" />
            <img className="arrowIcon" src="https://static.iqycamp.com/showMore-klrhl6x0.png" />
          </div>
          <div className="footerCont">
            <div className="videoCont">
              <video id="quanwaiVideo" className="quanwaiVideo">
                <source src="https://vd.yinyuetai.com/hc.yinyuetai.com/uploads/videos/common/D9D7016946B858C7358786E66AE0F650.mp4" type="video/mp4" />
              </video>
              <div className="videoMask" style={this.state.videoMaskShow === true ? {display:"block"} : {display:"none"}} onClick={() => this.playVideo()}>
                <div className="imgCont">
                <div className="imgPosition">
                <img className="quanwaiIcon" src="https://static.iqycamp.com/videoHeader-ebr90ug2.png" />
                <img className="playImg" src="https://static.iqycamp.com/playIcon-3oxe2us3.png" />
                </div>
                </div>
              </div>
            </div>
          </div>
          <ul className="introduceCont">
            <li className="introduce">
              <img className="inroduceImg" src="https://static.iqycamp.com/listIcon-kslhuvki.png" />
              <div>由全球第一人力咨询公司前总监孙圈圈创立</div>
            </li>
            <li className="introduce">
              <img className="inroduceImg" src="https://static.iqycamp.com/listIcon-kslhuvki.png" />
              <div>持续帮助10000+ 学员通过课程完成能力提升</div>
            </li>
            <li className="introduce">
              <img className="inroduceImg" src="https://static.iqycamp.com/listIcon-kslhuvki.png" />
              <div>国内唯一与哈佛、INSEAD等顶尖商学院合作案例教学的教育公司</div>
            </li>
            <li className="introduce">
              <img className="inroduceImg" src="https://static.iqycamp.com/listIcon-kslhuvki.png" />
              <div>中国银联、国家电网、上汽集团等诸多顶尖公司选圈外的方法培养人才</div>
            </li>
            <li className="introduce">
              <img className="inroduceImg" src="https://static.iqycamp.com/listIcon-kslhuvki.png" />
              <div>课程经专业教研团队持续迭代，线上社群服务保障90%+的逆天完课率</div>
            </li>
          </ul>
        </footer>
      </div>
    )
  }

}
