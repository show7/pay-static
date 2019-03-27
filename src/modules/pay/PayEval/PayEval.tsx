import * as React from 'react'
import './PayEval.less'
import {connect} from 'react-redux'
import {PayType, sa, refreshForPay, saTrack} from 'utils/helpers'
import {set, startLoad, endLoad, alertMsg} from 'redux/actions'
import {FooterButton} from '../../../components/submitbutton/FooterButton'
import AssetImg from '../../../components/AssetImg'
import RenderInBody from '../../../components/RenderInBody'
import {mark} from '../../../utils/request'
import {Button} from '../../../components/button/Button'
import PayInfo from '../components/PayInfo'
import {config, configShare} from 'modules/helpers/JsConfig'
import {
  checkRiseMember,
  getRiseMember,
  courseBuyValidate,
  loadInvitation,
  loadTask,
} from '../async'

@connect(state => state)
export default class SelfInit extends React.Component<any, any> {
  // static contextTypes = {
  //   router: React.PropTypes.object.isRequired,
  // }

  constructor() {
    super()
    this.state = {
      list: [1, 2],
      fiexdBuyButton: false,
      goodsId: 26,
      goodsInfo: {},
      pageIsShow: false,
      tip: '9.9',
      userEvaluation: [
        {
          userName: 'Vera',
          releaseTime: '3月11日',
          avatar: 'https://static.iqycamp.com/user1-chw7adcf.png',
          releaseContent:
            '平时很少有机会去回顾自己的工作习惯和工作方法，这次对自己的能力认真做了个盘点,确实在思维方面需要提升。',
        },
        {
          userName: '魏昊',
          releaseTime: '2月13日',
          avatar: 'https://static.iqycamp.com/user2-3d2gii0x.png',
          releaseContent:
            '优缺点分析得蛮透彻的，进一步提高自己的方法也说得很到位，已经在工作里用起来啦，希望能坚持下去。',
        },
      ],
    }
  }

  componentDidMount() {
    //设置分享配置
    configShare(
      `职业发展潜能测试`,
      `https://${window.location.hostname}/pay/eval`,
      'https://static.iqycamp.com/images/rise_share.jpg?imageslim',
      `快来测试一下你的职业发展潜能，洞察职场核心竞争力，由圈外商学院和华师大联合开发！`
    )
    mark({
      module: '打点',
      function: '测评售卖页曝光点',
      action: `进入测评售卖页`,
      memo: '测评售卖页曝光点',
    })
    //添加滚动监听（fiexd-button）
    window.addEventListener('scroll', this.setBuyButtonShow.bind(this))
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.setBuyButtonShow.bind(this))
  }

  setBuyButtonShow() {
    alert(123)
    // var scroll_top = 0
    // if (document.documentElement && document.documentElement.scrollTop) {
    //   scroll_top = document.documentElement.scrollTop
    // } else if (document.body) {
    //   scroll_top = document.body.scrollTop
    // }
    // const buyButtonOffsetTop =
    //   document.getElementsByClassName('buy-button')[0].offsetTop +
    //   document.getElementsByClassName('buy-button')[0].offsetHeight
    // this.setState({
    //   fiexdBuyButton: scroll_top > buyButtonOffsetTop,
    // })
  }

  async componentWillMount() {
    const {dispatch} = this.props
    try {
      const {msg} = await courseBuyValidate()
      const {paid, submit, submitId} = msg
      this.setState({
        pageIsShow: !(paid || submit),
      })
      // 提交过跳转结果页面&&&购买过跳转评测页面
      if (submit) {
        window.location.replace(
          `/rise/activity/static/guest/value/evaluation/self/complete?selfSubmitId=${submitId}`
        )
      } else if (paid) {
        window.location.replace(
          '/rise/activity/static/guest/value/evaluation/self/question'
        )
      }
    } catch (error) {
      dispatch(alertMsg(error))
    }

    // ios／安卓微信支付兼容性
    if (refreshForPay()) {
      return
    }
    const {goodsId} = this.state
    getRiseMember(goodsId).then(res => {
      console.log(res)
      if (res.code === 200) {
        this.setState({goodsInfo: res.msg})
      }
    })
  }

  /**
   * 重新注册页面签名
   */
  reConfig() {
    config(['chooseWXPay'])
  }

  /**
   * 打开支付窗口
   * @param goodsId 会员类型id
   */
  handleClickOpenPayInfo(goodsId) {
    const {dispatch} = this.props
    const {goodsInfo} = this.state
    const {privilege, errorMsg} = goodsInfo
    if (!privilege && !!errorMsg) {
      dispatch(alertMsg(errorMsg))
      return
    }
    const {riseId = '', type = 0} = this.props

    this.reConfig()
    dispatch(startLoad())
    // 先检查是否能够支付
    checkRiseMember(goodsId, riseId, type)
      .then(res => {
        dispatch(endLoad())
        if (res.code === 200) {
          console.log(res.msg)
          const {privilege, errorMsg} = res.msg
          if (privilege) {
            this.refs.payInfo.handleClickOpen()
          } else {
            dispatch(alertMsg(errorMsg))
          }
        } else {
          dispatch(alertMsg(res.msg))
        }
      })
      .catch(ex => {
        dispatch(endLoad())
        dispatch(alertMsg(ex))
      })
  }

  handleClickStart() {
    const {subscribe} = this.state
    if (!!subscribe) {
      mark({
        module: '打点',
        function: '价值观测评',
        action: '点击开始',
        memo: '已关注',
      })
      this.context.router.push({
        pathname: '/rise/activity/static/guest/value/evaluation/self/question',
      })
    } else {
      mark({
        module: '打点',
        function: '价值观测评',
        action: '点击开始',
        memo: '未关注',
      })
      this.setState({showQrCode: true})
    }
  }

  closeCode() {
    this.setState({showQrCode: false})
  }

  handlePayedDone() {
    const {goodsInfo} = this.state
    const {quanwaiGoods = {}} = goodsInfo
    mark({
      module: '打点',
      function: '测评售卖页点击点',
      action: '支付成功',
      memo: quanwaiGoods.id,
    })
    window.location.replace(
      '/rise/activity/static/guest/value/evaluation/self/question'
    )
  }
  handlepayedCancel() {
    const {goodsInfo} = this.state
    const {quanwaiGoods = {}} = goodsInfo
    mark({
      module: '打点',
      function: '测评售卖页点击点',
      action: '取消支付',
      memo: quanwaiGoods.id,
    })
  }

  render() {
    const {
      showQrCode,
      pageIsShow,
      fiexdBuyButton,
      goodsId,
      qrCode,
      tip,
      goodsInfo,
      userEvaluation,
    } = this.state
    const {quanwaiGoods = {}} = goodsInfo
    const userEvaluationItem = userEvaluation.map(item => {
      let {userName, avatar, releaseTime, releaseContent} = item
      return (
        <div key={userName}>
          <AssetImg url={avatar} style={{display: 'block'}} />
          <div>
            <h1>{userName}</h1>
            <div className="user-comment-times">发布时间：{releaseTime}</div>
            <div className="user-comment-text">
              <span className="top-quotation-marks">“</span>
              {releaseContent}
              <span className="top-quotation-marks">”</span>
            </div>
          </div>
        </div>
      )
    })
    return (
      pageIsShow && (
        <div className="self-init-component">
          <div>
            {/*<-- 头图 -->*/}
            <AssetImg
              url="https://static.iqycamp.com/banner-y2cisij9.jpg"
              width="100%"
            />
            <section className="self-init-container">
              <h2 className="self-init-title">职业发展竞争力测评</h2>
              <div className="self-init-title-tips">
                看看你有哪些没被充分开发的潜能？
              </div>
              <div className="self-init-price">
                ￥{tip} <span className="price-delete">￥99</span>
              </div>
              <div className="buy-button">
                <Button
                  str="立即购买"
                  callback={() => this.handleClickOpenPayInfo(goodsId)}
                />
              </div>
              <div className="self-init-point-tips">
                <div className="point-tips first">
                  <span className="tips-text">12项专业指标</span>
                </div>
                <div className="point-tips">
                  <span className="tips-text">华师大研究组联合开发</span>
                </div>
                <div className="point-tips last">
                  <span className="tips-text">7684人亲测</span>
                </div>
              </div>
            </section>
            <div className="grey-block" />
            <div className="self-init-container">
              <h4 className="self-init-block-title">
                <span className="block-title-text">
                  <span className="text">测评简介</span>
                </span>
              </h4>
              <div className="self-init-context">
                你是最了解自己的人，但你未必是最擅长
                <span className="high-line-text">发现自我优势</span>的人。
                如果忽略了自己的优势，照搬别人的成功故事，或者做自己不擅长的事情，是性价比最低的努力方式。
                <br />
                <br />
                职业选择中，也是如此：
                <br />- 可能你思维活跃，但是
                <span className="high-line-text">执行效率一般;</span>
                <br />- 可能你喜欢分析解决问题，但是
                <span className="high-line-text">不喜欢和人打交道;</span>
                <br />- 可能你擅长团队合作，但是
                <span className="high-line-text">管理工作容易陷入细节。</span>
                <br />
                <br />
                每个人都有自己的优势和不足，想要发挥职场潜能，你需要对自己的能力做一次彻底地盘点，并且有针对性地扬长补短。
                <br />
                <br />
                圈外同学联合
                <span className="high-line-text">
                  华东师范大学教育教练研究组
                </span>
                ，共同开发职业发展潜能测评，通过四大模块、12项专业指标的全面评估，展现你的职业发展潜能，帮你给自己
                <span className="high-line-text">
                  制定清晰合理的个人发展计划
                </span>
                。
              </div>
              <h4 className="self-init-block-title">
                <span className="block-title-text">
                  <span className="text">职业发展潜能模型</span>
                </span>
              </h4>
              <AssetImg
                url="https://static.iqycamp.com/screenshot-0ejtwqc0.png"
                width="100%"
                style={{
                  display: 'block',
                  margin: '0 auto',
                  padding: '3rem 0 0rem 0',
                }}
              />

              <h4 className="self-init-block-title">
                <span className="block-title-text">
                  <span className="text">专业报告样本</span>
                </span>
              </h4>
              <div className="self-init-context">
                <AssetImg
                  url="https://static.iqycamp.com/tree-q1udn0xf.png"
                  width="100%"
                  style={{
                    display: 'block',
                    margin: '0 auto',
                    padding: '3rem 0 0rem 0',
                  }}
                />
              </div>
              <h4 className="self-init-block-title">
                <span className="block-title-text">
                  <span className="text">用户评价</span>
                </span>
              </h4>
              <div className="user-satisfaction-wrap">{userEvaluationItem}</div>
              <h4 className="self-init-block-title">
                <span className="block-title-text">
                  <span className="text">测评须知</span>
                </span>
              </h4>
              <span className="self-init-context should-know">
                1、测评需要5-10分钟，为确保准确性，测评不能重复进行，请根据自己真实的行为表现完成问卷，不要去想自己想要什么，或者别人怎么看你。测评完成，你将获得一份专业的测评报告。
                <br />
                <br />
                2、测评过程中会自动保存你的回答，由于专业测评题目较多，可能需要几秒的加载时间，建议在稳定的网络环境下完成。
                <br />
                <br />
                3、测评结果会永久保存在“圈外职场学园”微信公众号，可以随时进入回复“竞争力测评”查看。
              </span>
              {/* <div style={{ width: '100%', height: '4.5rem' }}/> */}

              {!!showQrCode ? (
                <RenderInBody>
                  <div className="qr_dialog">
                    <div
                      className="qr_dialog_mask"
                      onClick={() => {
                        this.closeCode()
                      }}
                    />
                    <div className="qr_dialog_content">
                      <span>扫码后可进行测评哦</span>
                      <div className="qr_code">
                        <AssetImg url={qrCode} />
                      </div>
                    </div>
                  </div>
                </RenderInBody>
              ) : null}
            </div>
          </div>
          <div>
            {fiexdBuyButton ? (
              <div className="fiexd-buy-button">
                <FooterButton
                  wrapperClassName="primary"
                  btnArray={[
                    {
                      click: () => this.handleClickOpenPayInfo(goodsId),
                      text: `¥ ${tip} 限时购买`,
                    },
                  ]}
                />
              </div>
            ) : (
              ''
            )}
          </div>
          <div>
            {quanwaiGoods && (
              <PayInfo
                ref="payInfo"
                dispatch={this.props.dispatch}
                goodsType={quanwaiGoods.goodsType}
                goodsId={quanwaiGoods.id}
                header={quanwaiGoods.name}
                priceTips={tip}
                payedDone={goodsId => this.handlePayedDone(goodsId)}
                payedCancel={goodsId => this.handlepayedCancel(goodsId)}
                payedError={res => this.payedError()}
                payedBefore={() => {}}
                payType={PayType.WECHAT}
              />
            )}
          </div>
        </div>
      )
    )
  }
}
