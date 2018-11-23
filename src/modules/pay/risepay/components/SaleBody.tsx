import * as React from 'react'
import './SaleBody.less'
import { set, startLoad, endLoad, alertMsg } from 'redux/actions'
import { unScrollToBorder } from '../../../../utils/helpers'
import SequenceDisplay from '../../../../components/picture/SequenceDisplay'
import { mark } from '../../../../utils/request'
import * as _ from 'lodash';
import words = require('lodash/words')
import QYVideo from '../../../../components/QYVideo/QYVideo'

export class SaleBody extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor() {
    super()
    this.state = {
      showModel: false,
      loading: true,
    }
  }

  componentDidMount() {
    unScrollToBorder('#business-school-intro-pic-container')
  }

  clickUserProtocol() {
    const { memberTypeId = '3' } = this.props
    this.setState({
      showModel: true
    }, () => {
      mark({
        module: '打点',
        function: '售卖组件',
        action: '点击用户协议',
        memo: memberTypeId
      });
      // document.getElementById('business-school-intro-pic-container').style.overflow = 'scroll'
    })
  }

  disableUserProtocol() {
    this.setState({
      showModel: false
    }, () => {
      // document.getElementById('business-school-intro-pic-container').style.overflow = 'hidden'
    })

  }

  render() {
    const { memberTypeId = '3' } = this.props
    const { showModel, loading } = this.state

    const showUserProtocol = () => {

      return (
        <div className="shadow-container">
          <div className="user-protocol">
            <div className="relative-position">
              <div className="title">圈外同学用户协议</div>
              <div className="welcome">欢迎您来到圈外同学</div>
              <div className="content">
                <p>请您仔细阅读以下条款，如果您对本协议的任何条款表示异议，您可以选择不进入圈外同学。当您进入圈外同学，或者是直接或通过各类方式（如站外API引用等）
                  间接使用圈外同学服务和数据的行为，都将被视作已无条件接受本声明所涉全部内容。</p>
                <p>若您对本声明的任何条款有异议，请停止使用圈外同学所提供的全部服务。</p>
                <p className="q mg"> 使用规则</p>
                <p>1、为了保证你的学习效果，在圈外同学学习期间，同时最多可以开启3门课程的学习。</p>
                <p>2、每门课程有效期是30天，在有效期内可以随时学习。过了30天的有效期，如果还没有学完的章节，将无法解锁再次学习。</p>
                <p>3、圈外同学用户承诺不得以任何方式利用圈外同学直接或间接从事违反中国法律、以及社会公德的行为，圈外同学有权对违反上述承诺的内容予以删除。</p>
                <p>4、圈外同学用户不得利用圈外同学服务制作、上载、复制、发布、传播或者转载如下内容：</p>
                <p>· 反对宪法所确定的基本原则的；</p>
                <p>· 危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</p>
                <p>· 损害国家荣誉和利益的；</p>
                <p>· 煽动民族仇恨、民族歧视，破坏民族团结的；</p>
                <p>· 破坏国家宗教政策，宣扬邪教和封建迷信的；</p>
                <p>· 散布谣言，扰乱社会秩序，破坏社会稳定的；</p>
                <p>· 散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</p>
                <p>· 侮辱或者诽谤他人，侵害他人合法权益的；</p>
                <p>· 含有法律、行政法规禁止的其他内容的信息。</p>
                <p>
                  5、圈外同学有权对用户使用圈外同学的情况进行审查和监督，如用户在使用圈外同学时违反任何上述规定，圈外同学或其授权的人有权要求用户改正或直接采取一切必要的措施（包括但不限于更改或删除用户张贴的内容、暂停或终止用户使用圈外同学的权利）以减轻用户不当行为造成的影响。</p>

                <p className="q mg">版权声明</p>

                <p>圈外同学的所有官方内容，包括但不限于文字、音频、图片，其知识产权均为“圈外同学”或上海晓圈信息科技有限公司所有，包括但不限于著作权、商标权及专利权等。</p>
                <p>
                  未经相关权利人的明确书面授权，任何公司、媒体、网站及个人不得向任何自然人或单位提供营销、出售、出版，或出于播放或发布目的而改写或再发行，或者被用于其他任何商业目的。已经得到许可的，使用时必须注明“转载自圈外同学”。
                  圈外同学不就由上述资料产生或在传送或递交全部或部分上述资料过程中产生的延误、不准确、错误和遗漏或从中产生或由此产生的任何损害赔偿, 以任何形式, 向用户或任何第三方负责。
                  知识产权
                </p>
                <p>圈外同学尊重和鼓励圈外同学用户创作的内容，承诺将保护知识产权作为圈外同学运营的基本原则之一。</p>

                <p>1、用户在圈外同学上发表的原创内容，著作权均归用户本人所有。用户可授权第三方以任何方式使用，不需要得到圈外同学的同意。</p>
                <p>
                  2、圈外同学提供的网络服务中包含的标识、版面设计、排版方式、文本、图片、图形等均受著作权、商标权及其它法律保护，未经相关权利人（含圈外同学及其他原始权利人）同意，上述内容均不得在任何平台被直接或间接发布、使用、出于发布或使用目的的改写或再发行，或被用于其他任何商业目的。</p>
                <p>
                  3、为了促进其创作内容的分享和传播，用户将其在圈外同学上发表的全部内容，授予圈外同学免费的、不可撤销的、非独家使用许可，圈外同学有权将该内容用于圈外同学各种形态的产品和服务上，包括但不限于网站以及发表的应用或其他互联网产品。</p>
                <p>
                  4、第三方若出于非商业目的，将用户在圈外同学上发表的内容转载在圈外同学之外的地方，应当在作品的正文开头的显著位置注明原作者姓名（或原作者在圈外同学上使用的帐号名称），给出原始链接，注明「发表于圈外同学」，并不得对作品进行修改演绎。若需要对作品进行修改，或用于商业目的，第三方应当联系用户获得单独授权，按照用户规定的方式使用该内容。</p>
                <p>
                  5、在圈外同学上传或发表的内容，用户应保证其为著作权人或已取得合法授权，并且该内容不会侵犯任何第三方的合法权益。如果第三方提出关于著作权的异议，圈外同学有权根据实际情况删除相关的内容有权追究用户的法律责任，给圈外同学或任何第三方造成损失的，用户应负责全额赔偿。</p>
                <p>
                  6、如果任何第三方侵犯了圈外同学用户相关的权利，用户同意授权圈外同学或其指定的代理人代表圈外同学自身或用户对该第三方提出警告、投诉、发起行政执法、诉讼、进行上诉，或谈判和解，并且用户同意在圈外同学认为必要的情况下参与共同维权。</p>
                <p>7、圈外同学有权但无义务对用户发布的内容进行审核，有权根据相关证据结合《侵权责任法》、《信息网络传播权保护条例》等法律法规及圈外同学社区指导原则对侵权信息进行处理。</p>

                <p className="q mg"> 个人隐私</p>
                <p>
                  尊重用户个人隐私信息的私有性是圈外同学的一贯原则，圈外同学将通过技术手段、强化内部管理等办法充分保护用户的个人隐私信息，除法律或有法律赋予权限的政府部门要求或事先得到用户明确授权等原因外，圈外同学保证不对外公开或向第三方透露用户个人隐私信息，或用户在使用服务时存储的非公开内容。</p>
                <p>同时，为了运营和改善圈外同学的技术与服务，圈外同学将可能会自行收集使用或向第三方提供用户的非个人隐私信息，这将有助于圈外同学向用户提供更好的用户体验和服务质量。</p>
                <p className="q mg"> 侵权举报</p>
                <p>1、处理原则</p>

                <p>圈外同学高度重视自由表达和企业正当权利的平衡。依照法律规定删除违法信息是圈外同学社区的法定义务。</p>
                <p>2、受理范围</p>

                <p>受理圈外同学社区内侵犯企业或个人合法权益的侵权举报，包括但不限于涉及个人隐私、造谣与诽谤、商业侵权。</p>
                <p>涉及个人隐私：发布内容中直接涉及身份信息，如个人姓名、家庭住址、身份证号码、工作单位、私人电话等详细个人隐私；</p>
                <p>造谣、诽谤：发布内容中指名道姓（包括自然人和企业）的直接谩骂、侮辱、虚构中伤、恶意诽谤等；</p>
                <p>商业侵权：泄露企业商业机密及其他根据保密协议不能公开讨论的内容。</p>
                <p>3、举报条件</p>
                <p>
                  如果个人或单位发现圈外同学上存在侵犯自身合法权益的内容，请与圈外同学取得联系（邮箱：iquanwai@vip.163.com）。为了保证问题能够及时有效地处理，请务必提交真实有效、完整清晰的材料，否则不予受理。请使用以下格式（包括各条款的序号）：</p>
                <p>A、权利人对涉嫌侵权内容拥有商标权、著作权和/或其他依法可以行使权利的权属证明；如果举报人非权利人，请举报人提供代表企业进行举报的书面授权证明。</p>
                <p>B、充分、明确地描述侵犯了权利人合法权益的内容，提供涉嫌侵权内容在圈外同学上的具体页面地址，指明涉嫌侵权内容中的哪些内容侵犯了上述列明的权利人的合法权益；</p>
                <p>C、权利人具体的联络信息，包括姓名、身份证或护照复印件（对自然人）、单位登记证明复印件（对单位）、通信地址、电话号码、传真和电子邮件；</p>
                <p>D、在侵权举报中加入如下关于举报内容真实性的声明：</p>
                <p>· 我本人为所举报内容的合法权利人；</p>
                <p>· 我举报的发布在圈外同学社区中的内容侵犯了本人相应的合法权益；</p>
                <p>· 如果本侵权举报内容不完全属实，本人将承担由此产生的一切法律责任。</p>
                <p>4、处理流程</p>
                <p>出于网络社区的监督属性，并非所有申请都必须受理。圈外同学自收到举报邮件七个工作日内处理完毕并给出回复。处理期间，不提供任何电话、邮件及其他方式的查询服务。</p>
                <p>出现圈外同学已经删除或处理的内容，但是百度、谷歌等搜索引擎依然可以搜索到的现象，是因为百度、谷歌等搜索引擎自带缓存，此类问题圈外同学无权也无法处理，因此相关申请不予受理。</p>

                <p>此为圈外同学社区唯一的官方的侵权投诉渠道，暂不提供其他方式处理此业务。</p>
                <p>用户在圈外同学中的商业行为引发的法律纠纷，由交易双方自行处理，与圈外同学无关。</p>
                <p className="q mg">服务终止及暂停</p>
                <p>任何引起其他用户反感的行为，包括但不限于利用圈外同学平台发布广告或是垃圾信息，骚扰其他用户等，网站可随时行使暂停、收回、删除帐号的权利。</p>
                <p className="q mg"> 免责申明</p>
                <p>
                  1、用户在圈外同学发表的内容仅表明其个人的立场和观点，并不代表圈外同学的立场或观点。作为内容的发表者，需自行对所发表内容负责，因所发表内容引发的一切纠纷，由该内容的发表者承担全部法律及连带责任。圈外同学不承担任何法律及连带责任。</p>
                <p>2、圈外同学不保证网络服务一定能满足用户的要求，也不保证网络服务不会中断，对网络服务的及时性、安全性、准确性也都不作保证。</p>
                <p>3、对于因不可抗力或圈外同学不能控制的原因造成的网络服务中断或其它缺陷，圈外同学不承担任何责任，但将尽力减少因此而给用户造成的损失和影响。</p>
                <p className="q mg"> 协议修改</p>
                <p>
                  1、根据互联网的发展和有关法律、法规及规范性文件的变化，或者因业务发展需要，圈外同学有权对本协议的条款作出修改或变更，一旦本协议的内容发生变动，圈外同学将会直接在圈外同学网站上公布修改之后的协议内容，该公布行为视为圈外同学已经通知用户修改内容。圈外同学也可采用电子邮件或私信的传送方式，提示用户协议条款的修改、服务变更、或其它重要事项。</p>
                <p>2、如果不同意圈外同学对本协议相关条款所做的修改，用户有权并应当停止使用圈外同学。如果用户继续使用圈外同学，则视为用户接受圈外同学对本协议相关条款所做的修改。</p>

              </div>
              <div className="interval"></div>
            </div>
            <div className="user-submitbutton-component">
              <div className="user-submit-btn" onClick={() => this.disableUserProtocol()}>确认</div>
            </div>
          </div>
        </div>
      )
    }

    const mergeStyle = (style) => {
      return _.merge({}, {
        size: '100%',
        style: {
          display: 'block',
          margin: '0'
        },
        onClick: (e) => {
          e.preventDefault();
          return;
        },
      }, style);
    }

    if(memberTypeId == '3' || memberTypeId == '10') {
      return (
        <div className="business-school-intro-pic-container"
             id="business-school-intro-pic-container">
          <SequenceDisplay imgList={[
            mergeStyle({
              url: 'https://static.iqycamp.com/L2-1-f9tk08bn.jpg'
            }),
            // {
            //   dom: <CustomerEvaluate/>
            // },
            mergeStyle({
              url: 'https://static.iqycamp.com/L2-2-ryncimsh.jpg'
            }), mergeStyle({
              url: 'https://static.iqycamp.com/L2-3-xqv43jds.jpg'
            }),{
              dom: <div className="protocol-container l2">
                <span className="click_text">点击查看</span>
                <a className="protocol" onClick={() => this.clickUserProtocol()}>【商学院用户协议】</a>
              </div>
            }, mergeStyle({
              url: 'https://static.iqycamp.com/images/fragment/thought_sale_page_5_0523_1.jpg'
            })
          ]} onLoadFirst={() => this.setState({ loading: false })}/>

          {
            loading &&
            <div className="pic-loading-container">
              <img src="http://static.iqycamp.com/images/dribz.gif" className="loading-pic"
                   style={{ 'width': 300, 'display': 'block', 'margin': '0 auto' }}/>
            </div>
          }
          {showModel && showUserProtocol()}
          {/*{renderKefu()}*/}
        </div>
      )
    } else if(memberTypeId == '14') {
      return (
        <div className="business-school-intro-pic-container"
             id="business-school-intro-pic-container">
          <SequenceDisplay imgList={[
            mergeStyle({
              url: 'https://static.iqycamp.com/camp11-dp7htsri.jpg'
            }),
            mergeStyle({
              url: 'https://static.iqycamp.com/camp22-i726kw05.jpg'
            }),
            {
              dom: <div className="protocol-container l1">
                <span className="click_text">点击查看</span>
                <a className="protocol" onClick={() => this.clickUserProtocol()}>【商学院用户协议】</a>
              </div>
            }, mergeStyle({
              url: 'https://static.iqycamp.com/images/fragment/thought_sale_page_5_0523_1.jpg'
            })
          ]} onLoadFirst={() => this.setState({ loading: false })}/>

          {
            loading &&
            <div className="pic-loading-container">
              <img src="http://static.iqycamp.com/images/dribz.gif" className="loading-pic"
                   style={{ 'width': 300, 'display': 'block', 'margin': '0 auto' }}/>
            </div>
          }
          {showModel && showUserProtocol()}
        </div>
      )
    } else if(memberTypeId == '12') {
      return (
        <div className="business-school-intro-pic-container"
             id="business-school-intro-pic-container">
          <SequenceDisplay imgList={[
            mergeStyle({
              url: 'https://static.iqycamp.com/l1-7vn8t0ca.jpg'
            }),
            // {
            //   dom: <CustomerEvaluate/>
            // },
            mergeStyle({
              url: 'https://static.iqycamp.com/L1-02-9j7m1h6e.jpg'
            }), {
              dom: <div className="protocol-container l1">
                <span className="click_text">点击查看</span>
                <a className="protocol" onClick={() => this.clickUserProtocol()}>【商学院用户协议】</a>
              </div>
            }, mergeStyle({
              url: 'https://static.iqycamp.com/images/fragment/thought_sale_page_5_0523_1.jpg'
            })
          ]} onLoadFirst={() => this.setState({ loading: false })}/>

          {
            loading &&
            <div className="pic-loading-container">
              <img src="http://static.iqycamp.com/images/dribz.gif" className="loading-pic"
                   style={{ 'width': 300, 'display': 'block', 'margin': '0 auto' }}/>
            </div>
          }
          {showModel && showUserProtocol()}
         {/* {renderKefu()}*/}
        </div>
      )
    } else {
      return (
        <div className="business-school-intro-pic-container"
             id="business-school-intro-pic-container">
          <SequenceDisplay imgList={[
            mergeStyle({
              url: 'https://static.iqycamp.com/L3-01@2x 1-y8a99yor.jpg'
            }),
            {
              dom: <QYVideo fileId='5285890780601189027' videoPoster='https://static.iqycamp.com/images/thought_poster_0723.jpeg?imageslim'/>
            },
            mergeStyle({
              url: 'https://static.iqycamp.com/L3-02@2x-3fzc24w5.jpg'
            }),
            mergeStyle({
              url: 'https://static.iqycamp.com/L3-03@2x (1)-kk4heeuh.jpg'
            }), {
              dom: <div className="protocol-container thought">
                <div>本课程全部内容版权归圈外同学所有，严禁翻录成任何形式或在第三方平台传播，违者将追究法律责任。</div>
                <span className="click_text">点击查看</span>
                <u className="protocol"
                   onClick={() => this.clickUserProtocol()}>【圈外同学用户协议】</u>
              </div>
            },
            mergeStyle({
              url: 'https://static.iqycamp.com/images/fragment/thought_sale_page_5_0523_1.jpg'
            })
          ]} onLoadFirst={() => this.setState({ loading: false })}/>
          {
            loading &&
            <div className="pic-loading-container">
              <img src="http://static.iqycamp.com/images/dribz.gif" className="loading-pic"
                   style={{ 'width': 300, 'display': 'block', 'margin': '0 auto' }}/>
            </div>
          }
          {showModel && showUserProtocol()}
        {/*  {renderKefu()}*/}
        </div>
      )
    }

  }
}
