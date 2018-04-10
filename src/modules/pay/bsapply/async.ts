import { pget, ppost } from "../../../utils/request";

export function loadBusinessApplyQuestion() {
  return pget('/rise/business/load/questions');
}

export function checkSubmitApply(goodsId) {
  return pget('/rise/business/check/submit/apply', { goodsId: goodsId });
}

export function submitApply(param) {
  return ppost('/rise/business/submit/apply', param);
}

export function sendValidCode(phone) {
  return ppost('/rise/customer/send/valid/code', { phone: phone });
}

export function validSMSCode(param) {
  return ppost('/rise/customer/valid/sms', param);
}


export enum QuestionType {
  PICKER = 1,
  RADIO = 2,
  BLANK = 3,
  MULTI_BLANK = 4,
  AREA = 5,
  PHONE = 6,
  PIC = 7,
  UPLOAD_PIC = 8
}