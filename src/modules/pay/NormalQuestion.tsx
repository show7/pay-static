import * as React from "react"
import {connect} from "react-redux"
import {set, startLoad, endLoad, alertMsg} from "redux/actions"
import {changeTitle} from "utils/helpers"
import {pget, ppost} from "utils/request"
import "./NormalQuestion.less"
import { config, preview } from "../helpers/JsConfig"

@connect(state => state)
export default class PointTip extends React.Component<any,any> {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      point: null,
    }
  }

  componentWillMount() {
    changeTitle("了解更多");
    pget("/signup/mark/normal/question");
    const {memberType} = this.props.location.query;
    ppost('/b/mark', {
      module: "打点",
      function: "付费相关",
      action: "会员详情",
      memo: memberType
    });
  }

  render() {
    return (
      <div className="point-tip">
        <div className="point-tip-container">
          <div className="title">
            一、产品介绍<br/>
          </div>
          【圈外同学】针对职场最值钱的几种能力，如：思考能力、沟通能力等，教你套路，并带你刻意练习、提升竞争力：
          <img className="pic" src="https://static.iqycamp.com/images/CreamMoreMsgImg4.png"
               onClick={() => preview("https://static.iqycamp.com/images/CreamMoreMsgImg4.png", ["https://static.iqycamp.com/images/CreamMoreMsgImg4.png"])}/><br/>
          <b>1. 一年可在所有课程中选择36门小课学习，针对职场最值钱的几种能力来学习，以提升竞争</b>课程精炼了圈圈等大牛9年6个行业50家公司总结出的方法，让你用顶级公司的方法培养自己。
          <br/>
          <br/><b>2. 【小课训练营】的学习模式：你将与20位小伙伴形成小组、并肩战斗，有教练带着你手把手深度学习，</b>50%以上的学习都是互动、举例，而非枯燥讲解。
          <br/>
          <br/><b>3. 全年不间断、超过100场的学习活动，建立自己的学习圈子。</b>包括：各领域大咖直播、案例吊打、线下工作坊、各种资源分享会…… 帮你搭建BAT、世界500强等高质量职场资源
          <br/>
          <br/><b>4. 优秀学员可以进入圈外教练体系，圈圈亲自带你飞，并有机会成为圈外的合作伙伴（有钱的那种）。</b>
          <br/>圈外有一套完善的教练体系，优秀者可受邀加入。成绩优秀的学员，可以申请成为圈外教练，这意味着什么呢？
          <br/>1）免费学习圈外所有课程；
          <br/>2）拥有自己的导师，升到一定级别后圈圈将每月为你进行1对1咨询；
          <br/>3）成为圈外的合作伙伴，代表圈外给企业做培训；
          <br/>4）全年持续全面的不定期培训，接受一流的成长培养计划；
          <br/>5）跟一帮能力超强的小伙伴一起玩耍
          <br/>
          <br/><b>5. 为什么说这个产品让你值回票价？</b>
          <br/>——精英版的一年学习中，你将获得：
          <br/>24门自选小课
          <br/>12门训练营必修小课（共36门）
          <br/>12次大咖直播
          <br/>60次案例吊打学习活动
          <br/>获优秀学员与圈圈1V1沟通的机会
          <br/>线下工作坊（免费，且享有优先参与权）
          <br/>至少40次圈外专业教练点评
          <br/>成为教练的机会
          <br/>（精英版半年版以上服务数量减半）
          <br/>
          <br/>这些项目，如果拆开看，即便按照市场价，加起来也超过10000块，更何况是圈外的品质。
          <br/>报名通过系统自动进行，支付成功后概不退款，请予以理解。
          <img className="pic" src="https://static.iqycamp.com/images/CreamMoreMsgImg2.jpg"
               onClick={() => preview("https://static.iqycamp.com/images/CreamMoreMsgImg2.jpg", ["https://static.iqycamp.com/images/CreamMoreMsgImg2.jpg"])}/>
          <div className="title">
            <br/>二、Q&A:<br/>
          </div>
          <b style={{fontSize:"16px"}}>Q:我想知道半年和一年的课程内容是一样的吗？</b><br/>
          A:半年版和一年版在会员期间接收到的服务一模一样，只是会员时长不同 参考健身房半年卡和一年卡的权益即可（但是一年版显然更划算，因为半年后续费就不是现在这个价格咯）<br/><br/>


          <b style={{fontSize:"16px"}}>Q:工作比较忙，一天要花多久学习？</b><br/>
          A:【圈外同学】把每个知识点都拆分得很细，帮助工作党利用碎片时间进行系统学习。学习的时间因人而异，你可以根据自己的时间表和学习习惯进行调整，找到最适合你的学习时长。但我们建议大家至少每周完成1-2个小节的学习和练习，并将知识点结合到生活和工作场景中做输出练习。<br/><br/>


          <b style={{fontSize:"16px"}}>Q:【训练营】是不是没有了？</b><br/>
          A:今后【训练营】模式将成为【圈外同学】学习服务的一部分，一直等待【训练营】的同学直接报名【圈外同学】即可。【训练营】今后不再开放。<br/><br/>


          <b style={{fontSize:"16px"}}>Q: 我点击【圈外同学】付款后是一片空白／提示URL异常／页面样式混乱，怎么办？</b><br/>
          A:遇到此种情况，可以直接联系小黑 解决问题哦（微信ID：quanwaizhushou2）<br/><br/>


          <b style={{fontSize:"16px"}}>Q:线下工作坊一年办几次？</b><br/>
          A:6-20场（差距在于：场数需要根据当地学员的数量来决定。但一年至少六次；精英版成功抢到工作坊名额，即可免费参加）<br/><br/>
          <img className="pic" src="https://www.iqycamp.com/images/asst_xiaohei.jpeg?imageslim"
               onClick={() => preview("https://www.iqycamp.com/images/asst_xiaohei.jpeg?imageslim", ["https://www.iqycamp.com/images/asst_xiaohei.jpeg?imageslim"])}/><br/>
        </div>
      </div>
    )
  }
}
