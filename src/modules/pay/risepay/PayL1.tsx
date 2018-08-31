import * as React from 'react'
import * as _ from 'lodash'
import './PayL1.less'
import {connect} from 'react-redux'
import {mark} from 'utils/request'
import {PayType, sa, refreshForPay, saTrack} from 'utils/helpers'
import {set, startLoad, endLoad, alertMsg} from 'redux/actions'
import {config, configShare} from 'modules/helpers/JsConfig'
import PayInfo from '../components/PayInfo'
import {checkRiseMember, getRiseMember, loadInvitation, loadTask} from '../async'
import {SaleBody} from './components/SaleBody'
import {MarkBlock} from '../components/markblock/MarkBlock'
import {SubscribeAlert} from './components/SubscribeAlert'
import {SubscribeAlert} from './components/SubscribeAlert'
import InvitationLayout from '../components/invitationLayout/InvitationLayout'
import RenderInBody from '../../../components/RenderInBody'

@connect(state => state)
export default class PayL1 extends React.Component<any, any> {

    static contextTypes = {
        router: React.PropTypes.object.isRequired,
    }

    constructor() {
        super()
        this.state = {
            goodsId: 12,
            showErr: false,
            showCodeErr: false,
            subscribe: false,
            data: {},
            invitationLayout: false, // 弹框标识
            showShare: false,
            type: 0,
        }
    }

    async componentWillMount() {
        // ios／安卓微信支付兼容性
        if (refreshForPay()) {
            return
        }
        const {dispatch} = this.props
        dispatch(startLoad())

        let {riseId} = this.props.location.query
        //判断是否是老带新分享的链接
        if (!_.isEmpty(riseId)) {
            let param = {
                riseId: riseId,
                memberTypeId: 12,
            }
            let invitationInfo = await loadInvitation(param)
            this.setState({invitationData: invitationInfo.msg})
            if (invitationInfo.msg.isNewUser && invitationInfo.msg.isReceived) {
                dispatch(alertMsg('优惠券已经发到你的圈外同学账号咯！'))
            } else if (invitationInfo.msg.isNewUser) {
                this.setState({invitationLayout: true})
            }
        }
        // 查询订单信息
        getRiseMember(this.state.goodsId).then(res => {
            dispatch(endLoad())
            if (res.code === 200) {
                this.setState({data: res.msg})
                const {quanwaiGoods = {}} = res.msg
                const {privilege} = res.msg
                if (privilege) {
                    saTrack('openSalePayPage', {
                        goodsType: quanwaiGoods.goodsType + '',
                        goodsId: quanwaiGoods.id + '',
                    })
                    mark({module: '打点', function: quanwaiGoods.goodsType, action: quanwaiGoods.id, memo: '入学页面'})
                } else {
                    saTrack('openSaleApplyPage', {
                        goodsType: quanwaiGoods.goodsType + '',
                        goodsId: quanwaiGoods.id + '',
                    })
                    mark({module: '打点', function: quanwaiGoods.goodsType, action: quanwaiGoods.id, memo: '申请页面'})
                }
            } else {
                dispatch(alertMsg(res.msg))
            }
        }).catch((err) => {
            dispatch(endLoad())
            dispatch(alertMsg(err))
        })

        const {type = 0, taskId = 1} = this.props.location.query;
        if (type == 1) {
            this.setState({showShare: true});
            this.loadTask(taskId)
        }
    }

    /*获取值贡献*/
    loadTask(type) {
        loadTask(type).then((res) => {
            if (res.code == 200) {
                this.setState({task: res.msg})
            }
        })
    }

    /*投资圈外分享好友*/
    getsShowShare() {
        configShare(
            `【圈外同学】4个月时间体系化提升，成为职场超强个体`,
            `https://${window.location.hostname}/pay/l1?riseId=${window.ENV.riseId}&type=2`,
            `https://static.iqycamp.com/71527579350_-ze3vlyrx.pic_hd.jpg`,
            `${window.ENV.userName}邀请你成为同学，领取${this.state.task.shareAmount}元【圈外同学】L1项目入学优惠券`
        )
        mark({module: '打点', function: '关闭弹框l1', action: '点击关闭弹框'})
        this.setState({showShare: false, type: 1})
    }

    componentDidMount() {
        // TODO 设置分享
        // configShare(
        //   `圈外商学院--你负责努力，我们负责帮你赢`,
        //   `https://${window.location.hostname}/pay/rise`,
        //   'https://static.iqycamp.com/images/rise_share.jpg?imageslim',
        //   '最实用的竞争力提升课程，搭建最优质的人脉圈，解决最困扰的职场难题'
        // )
    }

    handlePayedDone() {
        const {data} = this.state
        const {quanwaiGoods = {}} = data
        mark({module: '打点', function: '商学院会员', action: '支付成功', memo: quanwaiGoods.id})
        this.context.router.push({
            pathname: '/pay/member/success',
            query: {
                goodsId: quanwaiGoods.id,
            },
        })
    }

    /** 处理支付失败的状态 */
    handlePayedError(res) {
        let param = _.get(res, 'err_desc', _.get(res, 'errMsg', ''))
        if (param.indexOf('跨公众号发起') != -1) {
            // 跨公众号
            this.setState({showCodeErr: true})
        } else {
            this.setState({showErr: true})
        }
    }

    /** 处理取消支付的状态 */
    handlePayedCancel() {
        this.setState({showErr: true})
    }

    /**
     * 打开支付窗口
     * @param goodsId 会员类型id
     */
    handleClickOpenPayInfo(goodsId) {
        const {dispatch} = this.props
        const {data} = this.state
        const {privilege, errorMsg} = data
        if (!privilege && !!errorMsg) {
            dispatch(alertMsg(errorMsg))
            return
        }
        const {riseId = '', type = 0} = this.props.location.query

        this.reConfig()
        dispatch(startLoad())
        // 先检查是否能够支付
        checkRiseMember(goodsId, riseId, type).then(res => {
            dispatch(endLoad())
            if (res.code === 200) {
                const {qrCode, privilege, errorMsg, subscribe} = res.msg
                if (subscribe) {
                    if (privilege) {
                        this.refs.payInfo.handleClickOpen()
                    } else {
                        dispatch(alertMsg(errorMsg))
                    }
                } else {
                    this.setState({qrCode: qrCode, showQr: true})
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

    handlePayedBefore() {
        const {data} = this.state
        const {quanwaiGoods = {}} = data
        mark({module: '打点', function: '商学院会员', action: '点击付费', memo: quanwaiGoods.id})
    }

    /**
     * 重新注册页面签名
     */
    reConfig() {
        config(['chooseWXPay'])
    }

    render() {
        const {data, showErr, showCodeErr, subscribe, goodsId, invitationLayout, showQr, qrCode, invitationData, showShare, type, task = {}} = this.state
        const {privilege, quanwaiGoods = {}, tip} = data;
        const {shareAmount, shareContribution, finishContribution} = task
        const {location} = this.props
        let payType = _.get(location, 'query.paytype')

        const renderPay = () => {
            if (!quanwaiGoods.id) return null
            return (
                <div className="button-footer">
                    <MarkBlock module={'打点'}
                               func={quanwaiGoods.id}
                               action={'点击入学按钮'}
                               memo={privilege}
                               className="footer-btn"
                               onClick={() => this.handleClickOpenPayInfo(quanwaiGoods.id)}>
                        立即入学
                    </MarkBlock>
                </div>
            )
        }

        return (
            <div className="rise-pay-container">
                <div className="pay-page">
                    <SaleBody memberTypeId={goodsId}/>
                    {renderPay()}
                </div>
                {
                    showErr &&
                    <div className="mask"
                         onClick={() => this.setState({showErr: false})}>
                        <div className="tips">
                            出现问题的童鞋看这里<br/> 1如果显示“URL未注册”，请重新刷新页面即可<br/> 2如果遇到“支付问题”，扫码联系招生办老师，并将出现问题的截图发给招生办老师<br/>
                        </div>
                        <img className="xiaoQ"
                             src="https://static.iqycamp.com/images/code_zsbzr_0703.jpeg?imageslim"/>
                    </div>
                }
                {
                    showCodeErr &&
                    <div className="mask"
                         onClick={() => this.setState({showCodeErr: false})}>
                        <div className="tips">
                            糟糕，支付不成功<br/> 原因：微信不支持跨公众号支付<br/> 怎么解决：<br/> 1，长按下方二维码，保存到相册；<br/> 2，打开微信扫一扫，点击右上角相册，选择二维码图片；<br/>
                            3，在新开的页面完成支付即可<br/>
                        </div>
                        <img className="xiaoQ"
                             style={{width: '50%'}}
                             src="https://static.iqycamp.com/images/code_zsbzr_0703.jpeg?imageslim"/>
                    </div>
                }
                {
                    quanwaiGoods &&
                    <PayInfo ref="payInfo"
                             dispatch={this.props.dispatch}
                             goodsType={quanwaiGoods.goodsType}
                             goodsId={quanwaiGoods.id}
                             header={quanwaiGoods.name}
                             priceTips={tip}
                             payedDone={(goodsId) => this.handlePayedDone(goodsId)}
                             payedCancel={(res) => this.handlePayedCancel(res)}
                             payedError={(res) => this.handlePayedError(res)}
                             payedBefore={() => this.handlePayedBefore()}
                             payType={payType || PayType.WECHAT}/>
                }
                {
                    subscribe && <SubscribeAlert closeFunc={() => this.setState({subscribe: false})}/>
                }

                {invitationLayout &&
                <InvitationLayout oldNickName={invitationData.oldNickName}
                                  amount={invitationData.amount}
                                  projectName={invitationData.memberTypeName}
                                  callBack={() => {
                                      this.setState({invitationLayout: false})
                                  }}/>
                }
                {!!showQr ? <RenderInBody>
                    <div className="qr_dialog">
                        <div className="qr_dialog_mask"
                             onClick={() => {
                                 this.setState({showQr: false})
                             }}></div>
                        <div className="qr_dialog_content">
                            <span>扫码后可进行申请哦</span>
                            <div className="qr_code">
                                <img src={qrCode}/>
                            </div>
                        </div>
                    </div>
                </RenderInBody> : null}
                {
                    showShare &&
                    <div className="share-mask-box">
                        <dev className="share-content">
                            <div className="share-content-top">
                                <p>可赠送好友 <br/><span>{shareAmount}元</span><br/> L1项目入学优惠券 </p>
                            </div>
                            <div className="share-content-bottom">
                                <div><span>1</span><p className='desc'>好友成功入学，你将获得{shareContribution}贡献值</p></div>
                                <div><span>2</span><p className='desc'>好友在开学1个月内按进度学习并完课，你将获得{finishContribution}贡献值</p>
                                </div>
                                <div className="button-bottom" onClick={() => {
                                    this.getsShowShare()
                                }}><p>立即邀请</p></div>
                            </div>
                        </dev>
                    </div>
                }
                {
                    type == 1 &&
                    <div className="type-share">
                        <img src="https://static.iqycamp.com/1091533182527_-sc42kog6.pic.jpg" alt="分享图片"/>
                    </div>
                }


            </div>
        )
    }
}
