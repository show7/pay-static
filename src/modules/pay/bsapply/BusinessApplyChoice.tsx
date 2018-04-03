import React, { Component } from 'react';
import { connect } from 'react-redux';
import './BusinessApplyChoice.less';
import { set, startLoad, endLoad, alertMsg } from "redux/actions"
import * as _ from 'lodash';
import { pget, ppost, mark } from "utils/request"
import { loadBusinessApplyQuestion, submitApply, sendValidCode, validSMSCode } from './async';
import DropDownList from "../../../components/form/DropDownList";
import $ from 'jquery';
import { FooterButton } from '../../../components/submitbutton/FooterButton'
import { getRiseMember, checkRiseMember } from '../async'
import { config } from '../../helpers/JsConfig'
import { getGoodsType } from '../../../utils/helpers'
import PayInfo from '../components/PayInfo'
import { UploadComponent } from '../../../components/form/UploadComponent';
import AssetImg from '../../../components/AssetImg'

@connect(state => state)
export default class BusinessApplyChoice extends Component<any, any> {
  constructor() {
    super();
    this.state = {
      showId: 7,
      questionGroup: [],
      seriesCount: 0,
      currentIndex: 0,
    }
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  async componentWillMount() {
    const { dispatch, region, location } = this.props;
    // ios／安卓微信支付兼容性
    if(!_.isEmpty(window.ENV.configUrl) && window.ENV.configUrl !== window.location.href) {
      window.location.href = window.location.href
      return
    }
    if(!region) {
      pget('/rise/customer/region').then(res => {
        if(res.code === 200) {
          dispatch(set("region", res.msg));
        } else {
          dispatch(alertMsg(res.msg));
        }
      }).catch(err => dispatch(alertMsg(err.msg)));
    }

    dispatch(startLoad())
    let questionRes = await loadBusinessApplyQuestion();
    if(questionRes.code === 200) {
      const { questions, payApplyFlag } = questionRes.msg;
      if(payApplyFlag) {
        //查询订单信息
        let orderRes = await getRiseMember(this.state.showId);
        if(orderRes.code === 200) {
          this.setState({ memberType: orderRes.msg.memberType });
        } else {
          dispatch(alertMsg(orderRes.msg));
        }
      }
      dispatch(endLoad())
      this.setState({ questionGroup: questions, seriesCount: questions.length, payApplyFlag: payApplyFlag });
    } else {
      dispatch(endLoad());
      dispatch(alertMsg(questionRes.msg));
    }

    mark({ module: "打点", function: "商学院审核", action: "进入填写报名信息页面" });
    mark({ module: "打点", function: "商学院审核", action: "翻页", memo: "1" });
  }

  /**
   * 处理当前题目group的变动
   * @param group 新的group对象
   * @param index 当前index
   */
  handleGroupChanged(group, index) {
    const { questionGroup, currentIndex, seriesCount, } = this.state
    let newGroups = _.cloneDeep(questionGroup);
    newGroups[ index ] = group;
    this.setState({ questionGroup: newGroups });
  }

  /**
   * 检查题目是否完成
   * @param question 题目
   * @param userChoices 用户选项
   */
  checkQuestionComplete(question, userChoices) {
    const { type, chosenId, preChoiceId, userValue, oneId, twoId, request, phoneCheckCode } = question;

    if(!!preChoiceId) {
      if(_.indexOf(userChoices, preChoiceId) === -1) {
        // 不满足前置条件，则不检查
        return true;
      }
    }
    if(!request) {
      // 不是必填
      return true;
    }

    switch(type) {
      case QuestionType.PICKER:
      case QuestionType.RADIO:
        return !!chosenId;
      case QuestionType.BLANK:
      case QuestionType.MULTI_BLANK:
      case QuestionType.PHONE:
      case QuestionType.UPLOAD_PIC:
        return !!userValue;
      case QuestionType.AREA:
        return !!oneId && !!twoId;
      default:
        return false;
    }
  }

  /**
   * 点击提交按钮
   */
  async handleClickSubmit() {
    const { dispatch, region } = this.props;
    const { questionGroup, currentIndex } = this.state

    let msg = await this.checkChoice(questionGroup, currentIndex)
    if(msg) {
      dispatch(alertMsg(msg))
      return
    }

    let result = _.reduce(questionGroup, (submitList, nextGroup) => {
      let subParam = _.reduce(nextGroup.questions, (tempList, question) => {
        let subTempParam = {};
        switch(question.type) {
          case QuestionType.PICKER:
          case QuestionType.RADIO:
            _.merge(subTempParam, { questionId: question.id, choiceId: question.chosenId });
            break;
          case QuestionType.BLANK:
          case QuestionType.MULTI_BLANK:
          case QuestionType.PHONE:
          case QuestionType.UPLOAD_PIC:
            if(!_.isEmpty(question.userValue)) {
              _.merge(subTempParam, { questionId: question.id, userValue: question.userValue });
            }
            break;
          case QuestionType.AREA:
            const provinceName = _.find(_.get(region, "provinceList"), { id: question.oneId }).value;
            const cityName = _.find(_.get(region, "cityList"), { id: question.twoId }).value;
            _.merge(subTempParam, { questionId: question.id, userValue: provinceName + '-' + cityName });
            break;
          default:
          // ignore
        }
        if(!_.isEmpty(subTempParam)) {
          tempList.push(subTempParam);
        }

        return tempList;
      }, []);
      submitList = submitList.concat(subParam);
      return submitList;
    }, []);

    this.submitApplyAPI({ userSubmits: result })
  }

  submitApplyAPI(param) {
    const { dispatch } = this.props;
    const { payApplyFlag } = this.state;

    mark({ module: "打点", function: "商学院审核", action: "提交申请" });
    // 开始提交
    submitApply(param).then(res => {
      dispatch(endLoad());
      if(res.code === 200) {
        if(!!payApplyFlag) {
          this.handleClickOpenPayInfo()
        } else {
          this.context.router.push('/pay/applysubmit');
        }
      } else {
        dispatch(alertMsg(res.msg));
      }
    }).catch(ex => {
      dispatch(endLoad());
      dispatch(alertMsg(ex));
    })
  }

  /**
   * 计算用户的选项
   * @param questionGroup 题目组
   * @returns 用户选项id的数组
   */
  calculateUserChoices(questionGroup) {
    return _.reduce(questionGroup, (resultArray, tempGroup) => {
      let tempArray = _.reduce(tempGroup.questions, (subArray, tempQuestion) => {
        if(tempQuestion.type === QuestionType.PICKER || tempQuestion.type === QuestionType.RADIO) {
          if(!!tempQuestion.chosenId) {
            subArray.push(tempQuestion.chosenId);
          }
        }
        return subArray;
      }, []);
      resultArray = resultArray.concat(tempArray);
      return resultArray;
    }, []);
  }

  /**
   * 点击下一步
   */
  async handleClickNextStep() {
    const { dispatch } = this.props;
    const { questionGroup, currentIndex } = this.state
    let msg = await this.checkChoice(questionGroup, currentIndex)
    if(msg) {
      dispatch(alertMsg(msg))
      return
    }

    this.nextStep()
  }

  async checkChoice(questionGroup, currentIndex) {
    const userChoices = this.calculateUserChoices(questionGroup);
    let group = questionGroup[ currentIndex ];
    let questions = group.questions;

    for(let i = 0; i < questions.length; i++) {
      let checkResult = this.checkQuestionComplete(questions[ i ], userChoices);
      if(!checkResult) {
        return '完成必填项后再点下一步哦'
      }
    }
    // 特殊检查电话
    let phoneQuestions = _.reduce(questionGroup, (questionList, nextGroup) => {
      let subQuestion = _.find(nextGroup.questions, { type: QuestionType.PHONE });
      if(!!subQuestion) {
        questionList.push(subQuestion);
      }
      return questionList;
    }, []);

    let phoneInfo = _.get(phoneQuestions, '[0]');
    const { preChoiceId, userValue, phoneCheckCode } = phoneInfo;
    let hasPhone = true;
    if(!!phoneInfo) {
      // 有电话题目
      if(!!preChoiceId) {
        // 如果有前置选项，并且前置选项没有选，则不渲染这个
        if(_.indexOf(userChoices, preChoiceId) === -1) {
          hasPhone = false;
        }
      }
    }
    if(hasPhone) {
      if(!phoneCheckCode) {
        return '请输入验证码'
      }

      let res = await validSMSCode({ phone: userValue, code: phoneCheckCode })
      if(res.code !== 200) {
        return '验证码错误，请重新输入'
      }
    }

    return ''
  }

  nextStep() {
    const { questionGroup, currentIndex, } = this.state
    let group = questionGroup[ currentIndex ];
    let nextIndex = this.findNextVisibleIndex(questionGroup, currentIndex);
    this.setState({ group: group }, () => {
      $('.question-group').animateCss('fadeOutLeft', () => {
        this.setState({ currentIndex: nextIndex }, () => {
          mark({ module: "打点", function: "商学院审核", action: "翻页", memo: questionGroup[ nextIndex ].series + "" });
          $('.question-group').animateCss('fadeInRight')
        })
      })
    })
  }

  findPreVisibleIndex(questionGroup, currentIndex) {
    let wannaIndex = currentIndex - 1;
    const userChoices = this.calculateUserChoices(questionGroup);

    if(questionGroup.length <= wannaIndex) {
      return wannaIndex
    } else {
      // 开始查找
      for(let i = wannaIndex; i > 0; i--) {
        let group = questionGroup[ i ];
        // 可以显示的题目
        let filterGroup = _.filter(group.questions, item => {
          // 没有前置选项 || 有，但是满足
          return !item.preChoiceId || _.indexOf(userChoices, item.preChoiceId) !== -1;
        })
        if(!_.isEmpty(filterGroup)) {
          return i;
        }
      }
      // 如果一个也找不到，就return第一个
      return 0;
    }
  }

  findNextVisibleIndex(questionGroup, currentIndex) {
    let wannaIndex = currentIndex + 1;
    const userChoices = this.calculateUserChoices(questionGroup);

    if(questionGroup.length <= wannaIndex) {
      return wannaIndex
    } else {
      // 开始查找
      for(let i = wannaIndex; i < questionGroup.length; i++) {
        let group = questionGroup[ i ];
        // 可以显示的题目
        let filterGroup = _.filter(group.questions, item => {
          // 没有前置选项 || 有，但是满足
          return !item.preChoiceId || _.indexOf(userChoices, item.preChoiceId) !== -1;
        })
        if(!_.isEmpty(filterGroup)) {
          return i;
        }
      }
      // 如果一个也找不到，就return最后一组
      return questionGroup.length - 1;
    }
  }

  /**
   * 点击上一步
   */
  prevStep() {
    const { questionGroup, currentIndex, seriesCount, } = this.state
    let preIndex = this.findPreVisibleIndex(questionGroup, currentIndex);
    $('.question-group').animateCss('fadeOutRight', () => {
      this.setState({ currentIndex: preIndex },
        () => {
          $('.question-group').animateCss('fadeInLeft');
        }
      )
    })
  }

  handlePayedDone() {
    mark({ module: '打点', function: '商学院申请', action: '支付成功' })
    // this.handleClickSubmit()
    this.context.router.push('/pay/applysubmit');
  }

  /** 处理支付失败的状态 */
  handlePayedError(res) {
    let param = _.get(res, 'err_desc', _.get(res, 'errMsg', ''))

    if(param.indexOf('跨公众号发起') != -1) {
      // 跨公众号
      this.setState({ showCodeErr: true })
    } else {
      this.setState({ showErr: true })
    }
  }

  /** 处理取消支付的状态 */
  handlePayedCancel(res) {
    this.setState({ showErr: true })
  }

  /**
   * 打开支付窗口
   * @param showId 会员类型id
   */
  handleClickOpenPayInfo() {
    this.reConfig()
    const { dispatch } = this.props
    const { questionGroup, currentIndex, } = this.state

    // let group = questionGroup[ currentIndex ];
    // let questions = group.questions;
    // const userChoices = this.calculateUserChoices(questionGroup);
    // for(let i = 0; i < questions.length; i++) {
    //   let checkResult = this.checkQuestionComplete(questions[ i ], userChoices);
    //   if(!checkResult) {
    //     dispatch(alertMsg("完成必填项后再点下一步哦"));
    //     return;
    //   }
    // }

    dispatch(startLoad())
    // 先检查是否能够支付
    checkRiseMember(this.state.showId).then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
        // 查询是否还在报名
        this.refs.payInfo.handleClickOpen()
      } else {
        dispatch(alertMsg(res.msg))
      }
    }).catch(ex => {
      dispatch(endLoad())
      dispatch(alertMsg(ex))
    })
    mark({ module: '打点', function: '商学院申请', action: '点击加入按钮' })
  }

  handlePayedBefore() {
    mark({ module: '打点', function: '商学院申请', action: '点击付费' })
  }

  /**
   * 重新注册页面签名
   */
  reConfig() {
    config([ 'chooseWXPay' ])
  }

  render() {
    const { questionGroup, currentIndex, seriesCount, showErr, showCodeErr, memberType, payApplyFlag } = this.state

    const isSelected = (choices, choice) => {
      return !_.isEmpty(_.find(choices, {
        id: choice.id, choice: true
      }));
    }

    const renderButtons = () => {
      if(currentIndex === 0) {
        return (
          <FooterButton btnArray={[ {
            click: () => this.handleClickNextStep(),
            text: '下一步'
          } ]}/>
        )
      } else if(currentIndex === seriesCount - 1) {
        if(!!payApplyFlag) {
          return (
            <FooterButton btnArray={[ {
              click: () => this.handleClickSubmit(),
              // this.handleClickOpenPayInfo(),
              text: '1元预约'
            } ]}/>
          )
        } else {
          return (
            <FooterButton btnArray={[ {
              click: () => this.handleClickSubmit(),
              text: '提交'
            } ]}/>
          )
        }
      } else {
        return (
          <FooterButton btnArray={[ {
            click: () => this.prevStep(),
            text: '上一步'
          }, {
            click: () => this.handleClickNextStep(),
            text: '下一步'
          } ]}/>
        )
      }
    }

    return (
      <div className="apply-choice" style={{ minHeight: window.innerHeight }}>
        <div className="apply-container">
          <div className="apply-page-header">圈外商学院入学沟通预约</div>
          {/*<div className="apply_rate">*/}
          {/*<img src="https://static.iqycamp.com/images/progress_bar2.png?imageslim" width={'100%'}/>*/}
          {/*</div>*/}
          <div className="apply-progress">
            <div className="apply-progress-bar"
                 style={{ width: (window.innerWidth - 90 - 38) * (currentIndex / (seriesCount - 1)) }}/>
          </div>
          <div className="apply-progress-page-index">{currentIndex + 1} / {questionGroup.length}</div>
          <QuestionGroup currentIndex={currentIndex} group={questionGroup[ currentIndex ]} allGroup={questionGroup}
                         region={this.props.region}
                         onGroupChanged={(group) => this.handleGroupChanged(group, currentIndex)}/>
        </div>
        <div style={{ height: '65px', width: '100%' }}/>
        {renderButtons()}

        {showErr ? <div className="pay-tips-mask" onClick={() => this.setState({ showErr: false })}>
          <div className="tips">
            出现问题的童鞋看这里<br/>
            1如果显示“URL未注册”，请重新刷新页面即可<br/>
            2如果遇到“支付问题”，扫码联系小黑，并将出现问题的截图发给小黑<br/>
          </div>
          <img className="xiaoQ" src="https://static.iqycamp.com/images/asst_xiaohei.jpeg?imageslim"/>
        </div> : null}
        {showCodeErr ? <div className="pay-tips-mask" onClick={() => this.setState({ showCodeErr: false })}>
          <div className="tips">
            糟糕，支付不成功<br/>
            原因：微信不支持跨公众号支付<br/>
            怎么解决：<br/>
            1，长按下方二维码，保存到相册；<br/>
            2，打开微信扫一扫，点击右上角相册，选择二维码图片；<br/>
            3，在新开的页面完成支付即可<br/>
          </div>
          <img className="xiaoQ" style={{ width: '50%' }}
               src="https://static.iqycamp.com/images/pay_camp_code.png?imageslim"/>
        </div> : null}
        {memberType && <PayInfo ref="payInfo"
                                dispatch={this.props.dispatch}
                                goodsType={getGoodsType(memberType.id)}
                                goodsId={memberType.id}
                                header={memberType.name}
                                payedDone={(goodsId) => this.handlePayedDone()}
                                payedCancel={(res) => this.handlePayedCancel(res)}
                                payedError={(res) => this.handlePayedError(res)}
                                payedBefore={() => this.handlePayedBefore()}
        />}
      </div>
    )
  }
}

interface QuestionGroupProps {
  group: any,
  onGroupChanged?: any,
  allGroup: any,
  region?: any,
  currentIndex: any,
}

enum QuestionType {
  PICKER = 1,
  RADIO = 2,
  BLANK = 3,
  MULTI_BLANK = 4,
  AREA = 5,
  PHONE = 6,
  PIC = 7,
  UPLOAD_PIC = 8
}

@connect(state => state)
class QuestionGroup extends Component<QuestionGroupProps, any> {
  constructor() {
    super();
    this.state = { codeTimeRemain: 0 }
    this.intervalTrigger = null;
  }

  componentWillMount() {
  }

  /**
   * 通用的onChange处理方法
   * @param question 问题信息
   * @param value 值
   * @param keyName 键名
   */
  commonHandleValueChange(question, value, keyName) {
    const { group = {} } = this.props;
    const { questions = [] } = group;
    let key = _.findIndex(questions, { id: question.id });
    let result = _.set(_.cloneDeep(group), `questions[${key}]`, _.set(_.cloneDeep(question), keyName, value));
    console.log(result);
    this.props.onGroupChanged(result);
  }

  /**
   * 点击选择区域
   * @param question 问题信息
   * @param one 省
   * @param two 市
   */
  handleChoiceRegion(question, one, two) {
    const { group = {} } = this.props;
    const { questions = [] } = group;
    let key = _.findIndex(questions, { id: question.id });
    let result = _.set(_.cloneDeep(group), `questions[${key}]`, _.set(_.cloneDeep(question), 'oneId', one.id));
    _.set(result, `questions[${key}].twoId`, two.id);
    this.props.onGroupChanged(result);
  }

  /**
   * 点击发送验证码
   */
  handleClickSendPhoneCode(questionInfo) {
    const { phoneCheckCode, userValue } = questionInfo;
    const { codeTimeRemain = 0 } = this.state;
    const { dispatch } = this.props;
    if(codeTimeRemain !== 0) {
      dispatch(alertMsg(`请${codeTimeRemain}秒稍后再试`));
      return;
    } else {
      // 可以发送，检查phone
      let NUMBER_REG = /^[0-9]+$/;
      if(!userValue) {
        dispatch(alertMsg('请输入手机号码'));
        return;
      }

      if(!NUMBER_REG.test(userValue)) {
        dispatch(alertMsg('请输入格式正确的手机'));
        return;
      }

      if(!!this.intervalTrigger) {
        clearInterval(this.intervalTrigger);
      }
      this.setState({ codeTimeRemain: 60 }, () => {
        this.intervalTrigger = setInterval(() => {
          this.setState({ codeTimeRemain: this.state.codeTimeRemain - 1 });
          if(this.state.codeTimeRemain <= 0) {
            clearInterval(this.intervalTrigger);
          }
        }, 1000);
      })

      // 发送验证码
      sendValidCode(userValue).then(res => {
        if(res.code !== 200) {
          dispatch(alertMsg(res.msg));
        }
      });
    }

  }

  handleUploadError(msg) {
    const { dispatch } = this.props;
    dispatch(endLoad());
    dispatch(alertMsg(msg));
  }

  handleUploadStart(msg) {
    const { dispatch } = this.props;
    dispatch(startLoad());
  }

  handleUploadSuccess(msg, questionInfo) {
    const { dispatch } = this.props;
    dispatch(endLoad());
    // 上传成功
    this.commonHandleValueChange(questionInfo, msg, 'userValue')
  }

  render() {
    const { group = {}, allGroup = [], region, currentIndex } = this.props
    const { questions = [] } = group

    const provinceList = _.get(region, "provinceList");
    const cityList = _.get(region, "cityList");

    const userChoices = _.reduce(allGroup, (resultArray, tempGroup) => {
      let tempArray = _.reduce(tempGroup.questions, (subArray, tempQuestion) => {
        if(tempQuestion.type === QuestionType.PICKER || tempQuestion.type === QuestionType.RADIO) {
          if(!!tempQuestion.chosenId) {
            subArray.push(tempQuestion.chosenId);
          }
        }
        return subArray;
      }, []);
      resultArray = resultArray.concat(tempArray);
      return resultArray;
    }, []);

    const renderPickerQuestion = (questionInfo) => {
      const { question, type, sequence, request, preChoiceId, id, series, tips, choices, chosenId, placeholder } = questionInfo;
      let userData = {
        id: chosenId,
      }
      _.forEach(choices, (item, key) => {
        item.value = item.subject;
        if(item.id === chosenId) {
          userData.value = item.value;
        }
      });
      //
      let defaultValue = _.find(choices, { defaultSelected: true });
      return mixQuestionDom(questionInfo,
        <div className="picker-box">
          <DropDownList rootClassName="apply-picker"
                        level={1} data={[ choices ]} userData={chosenId ? [ userData ] : null}
                        defaultData={defaultValue ? [ {
                          id: defaultValue.id, value: defaultValue.subject
                        } ] : undefined}
                        onChoice={(one) => this.commonHandleValueChange(questionInfo, Number.parseInt(one.id), 'chosenId')}
                        placeholder={placeholder}
          />
        </div>
      )
    }

    const mixQuestionDom = (questionInfo, QuestionDom) => {
      const { question, type, sequence, request, preChoiceId, id, series, tips, choices, chosenId } = questionInfo;

      return (
        <div className="question" key={questionInfo.id}>
          <div className="question-label">
            <span dangerouslySetInnerHTML={{ __html: question }}/>
            {request ? <span style={{ color: 'red' }}>*</span> : null}
          </div>
          {tips ? <div className="question-tips" dangerouslySetInnerHTML={{ __html: tips }}/> : null}
          {QuestionDom}
        </div>
      )
    }

    const renderRadioQuestion = (questionInfo) => {
      const { question, type, sequence, request, preChoiceId, id, series, tips, choices, chosenId } = questionInfo;
      return mixQuestionDom(questionInfo,
        <div className="question-radio">
          <ul className="radio-wrapper">
            {choices.map((choice) => {
              return (
                <li className="radio-choice" key={choice.id}
                    onClick={() => this.commonHandleValueChange(questionInfo, Number.parseInt(choice.id), 'chosenId')}>
                  <span className={`list-style ${chosenId === choice.id ? 'selected' : ''}`}/>
                  <span className="list-text">{choice.subject}</span>
                </li>
              )
            })}
          </ul>
        </div>
      )
    }

    const renderPhoneQuestion = (questionInfo) => {
      const { question, type, sequence, request, preChoiceId, id, series, tips, choices, chosenId, placeholder, userValue, phoneCheckCode } = questionInfo;
      const { codeTimeRemain = 0 } = this.state;
      return mixQuestionDom(questionInfo,
        <div>
          <div className="question-blank">
            <input type="text" placeholder={placeholder ? placeholder : '请填写'} value={userValue}
                   onChange={(e) => this.commonHandleValueChange(questionInfo, e.target.value, 'userValue')}/>
          </div>
          <div className="check-code-wrapper">
            <span className="code-send-label">验证码：</span>
          </div>
          <div className="send-phone-blank" style={{ margin: '0 0 20px' }}>
            <input type="text" placeholder='请填写验证码' value={phoneCheckCode}
                   onChange={(e) => this.commonHandleValueChange(questionInfo, e.target.value, 'phoneCheckCode')}/>
          </div>
          <div className={`send-phone-code ${codeTimeRemain === 0 ? 'free' : 'sending'}`}
               onClick={() => this.handleClickSendPhoneCode(questionInfo)}>
            {codeTimeRemain === 0 ? '发送验证码' : `${codeTimeRemain}秒后重新发送`}
          </div>
        </div>
      )
    }

    const renderBlankQuestion = (questionInfo) => {
      const { question, type, sequence, request, preChoiceId, id, series, tips, choices, chosenId, placeholder, userValue } = questionInfo;
      return mixQuestionDom(questionInfo,
        <div className="question-blank">
          <input type="text" placeholder={placeholder ? placeholder : '请填写'} value={userValue}
                 onChange={(e) => this.commonHandleValueChange(questionInfo, e.target.value, 'userValue')}/>
        </div>
      )
    }

    const renderMultiBlankQuestion = (questionInfo) => {
      const { question, type, sequence, request, preChoiceId, id, series, tips, choices, chosenId, placeholder, userValue } = questionInfo;
      return mixQuestionDom(questionInfo,
        <div className="question-multi-blank">
          <textarea type="text" placeholder={placeholder ? placeholder : '请填写'} value={userValue}
                    onChange={(e) => this.commonHandleValueChange(questionInfo, e.target.value, 'userValue')}
                    rows={5}
          />
        </div>
      )
    }

    const renderAreaQuestion = (questionInfo) => {
      const { question, type, sequence, request, preChoiceId, id, series, tips, choices, chosenId, oneId, twoId } = questionInfo;
      let userData = [
        { id: oneId }, { id: twoId }
      ];
      if(!!oneId && !!twoId) {
        _.set(userData, '[0].value', _.get(_.find(provinceList, { id: oneId }), 'value'));
        _.set(userData, '[1].value', _.get(_.find(cityList, { id: twoId }), 'value'));
      }

      return mixQuestionDom(questionInfo,
        <div className="picker-box">
          <DropDownList rootClassName="apply-picker"
                        level={2} data={[ provinceList, cityList ]} userData={userData[ 1 ].id ? userData : null}
                        onChoice={(one, two) => this.handleChoiceRegion(questionInfo, one, two)}/>
        </div>
      )
    }

    const renderPic = (questionInfo) => {
      const { question } = questionInfo;

      return (
        <div className="question-pic">
          <div className="question-pic-text">
            你将会在以上时间收到招生委员会的电话/语音面试。委员会由圈外创始人团队、投资人、CEO教练和顶级公司HR等权威专家构成。
          </div>
          <img src={question} width={'100%'} height={'100%'} style={{ display: 'block' }}/>
        </div>
      )
    }

    const renderUploadPic = (questionInfo) => {
      const { question, type, sequence, request, preChoiceId, id, series, tips, choices, chosenId, oneId, twoId } = questionInfo;

      return mixQuestionDom(questionInfo,
        <div className='upload-image'>
          <UploadComponent handleUploadError={(msg) => this.handleUploadError(msg, questionInfo)}
                           handleUploadStart={(msg) => this.handleUploadStart(msg, questionInfo)}
                           handleUploadSuccess={(msg) => this.handleUploadSuccess(msg, questionInfo)}
                           uploadedUrl={questionInfo.userValue}
                           successIcon={true}
          />
        </div>
      )
    }

    return (
      <div className='question-group'>
        {questions && questions.map((item, key) => {
          const { type, request, preChoiceId } = item;
          if(!!preChoiceId) {
            // 如果有前置选项，并且前置选项没有选，则不渲染这个
            if(_.indexOf(userChoices, preChoiceId) === -1) {
              return null;
            }
          }
          switch(type) {
            case QuestionType.PICKER:
              return renderPickerQuestion(item);
            case QuestionType.RADIO:
              return renderRadioQuestion(item);
            case QuestionType.BLANK:
              return renderBlankQuestion(item);
            case QuestionType.AREA:
              return renderAreaQuestion(item);
            case QuestionType.MULTI_BLANK:
              return renderMultiBlankQuestion(item);
            case QuestionType.PHONE:
              return renderPhoneQuestion(item);
            case QuestionType.PIC:
              return renderPic(item);
            case QuestionType.UPLOAD_PIC:
              return renderUploadPic(item);
            default:
              return null;
          }
        })}
      </div>
    )
  }
}
