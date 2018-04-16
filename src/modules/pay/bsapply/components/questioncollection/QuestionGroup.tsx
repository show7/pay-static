import React, { Component } from 'react';
import { connect } from 'react-redux';
import './QuestionGroup.less';
import * as _ from 'lodash';
import DropDownList from '../../../../../components/form/DropDownList'
import { QuestionType,sendValidCode } from '../../async'
import { set, startLoad, endLoad, alertMsg } from "redux/actions"

interface QuestionGroupProps {
  group: any,
  onGroupChanged?: any,
  allGroup: any,
  region?: any,
  currentIndex: any,
}

@connect(state => state)
export default class QuestionGroup extends Component<QuestionGroupProps, any> {
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
