import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import './QuestionCollection.less';
import QuestionGroup from './QuestionGroup';
import { loadBusinessApplyQuestion, QuestionType, submitApply, sendValidCode, validSMSCode } from '../../async'
import { FooterButton } from '../../../../../components/submitbutton/FooterButton'
import { mark, pget } from '../../../../../utils/request'
import { set, startLoad, endLoad, alertMsg } from "redux/actions"

import $ from 'jquery';


interface QuestionCollectionProps {
  goodsId: string,
  handleClickOpenPayInfo: any,
}

@connect(state => state)
export default class QuestionCollection extends Component<QuestionCollectionProps, any> {
  constructor() {
    super();
    this.state = {
      currentIndex: 0,
      seriesCount: 0,
    }
  }

  componentWillMount() {

  }

  async componentDidMount() {
    const { region, dispatch, goodsId } = this.props;
    if(!region) {
      let res = await pget('/rise/customer/region');
      dispatch(set("region", res.msg));
    }
    let questionRes = await loadBusinessApplyQuestion();
    const { questions, payApplyFlag } = questionRes.msg;

    this.setState({ questionGroup: questions, seriesCount: questions.length, payApplyFlag: payApplyFlag });
    mark({ module: "申请填写", function: goodsId + '', action: "进入填写报名信息页面" });
    mark({ module: "申请填写", function: goodsId + '', action: "翻页", memo: "1" });
  }

  /**
   * 点击下一步
   */
  async handleClickNextStep() {
    const { dispatch } = this.props;
    const { currentIndex, questionGroup } = this.state
    let msg = await this.checkChoice(questionGroup, currentIndex)
    if(msg) {
      dispatch(alertMsg(msg))
      return
    }

    this.nextStep()
  }

  /**
   * 检是否完成该组问题
   * @param questionGroup 问题组
   * @param currentIndex 当前进行的index
   * @return {Promise<any>} check结果
   */
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

  /**
   * 点击下一步
   */
  nextStep() {
    const { goodsId } = this.props;
    const { currentIndex, questionGroup } = this.state
    let group = questionGroup[ currentIndex ];
    let nextIndex = this.findNextVisibleIndex(questionGroup, currentIndex);
    this.setState({ group: group }, () => {
      $('.question-group').animateCss('fadeOutLeft', () => {
        this.setState({ currentIndex: nextIndex }, () => {
          mark({ module: "申请填写", function: goodsId, action: "翻页", memo: questionGroup[ nextIndex ].series + "" });
          $('.question-group').animateCss('fadeInRight')
        })
      })
    })
  }

  /**
   * 找到上一个可见的index
   * @param questionGroup 当前可见的问题组
   * @param currentIndex 当前展示的index
   * @return {number} 上一个可见的index
   */
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

  /**
   * 找到下一个
   * @param questionGroup 当前显示的问题组
   * @param currentIndex 当前显示的index
   * @return {any} 下一个可见的index
   */
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
   * 提交问卷申请
   * @param param 问卷内容
   */
  submitApplyAPI(param) {
    const { dispatch, handleClickOpenPayInfo = () => {}, goodsId } = this.props;
    const { payApplyFlag } = this.state;

    mark({ module: "申请填写", function: goodsId, action: "提交申请" });
    // 开始提交
    dispatch(startLoad());
    submitApply(param).then(res => {
      dispatch(endLoad());
      if(res.code === 200) {
        if(!!payApplyFlag) {
          handleClickOpenPayInfo()
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
    const { dispatch, region, goodsId } = this.props;
    const { questionGroup, currentIndex } = this.state

    // 检查本页是否提交完成
    let msg = await this.checkChoice(questionGroup, currentIndex)
    if(msg) {
      dispatch(alertMsg(msg))
      return
    }

    // 所有提交结果
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

    // 调用提交api
    this.submitApplyAPI({ userSubmits: result, goodsId: goodsId })
  }

  /**
   * 点击上一步
   */
  prevStep() {
    const { currentIndex, seriesCount, questionGroup } = this.state
    let preIndex = this.findPreVisibleIndex(questionGroup, currentIndex);
    $('.question-group').animateCss('fadeOutRight', () => {
      this.setState({ currentIndex: preIndex },
        () => {
          $('.question-group').animateCss('fadeInLeft');
        }
      )
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

  render() {
    const { currentIndex, questionGroup = [], seriesCount, showErr, showCodeErr, memberType, payApplyFlag } = this.state
    console.log(questionGroup)
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
      <div className="question-collection">
        <div className="apply-container">
          <div className="apply-page-header">圈外商学院入学沟通预约</div>
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
      </div>
    )
  }

}