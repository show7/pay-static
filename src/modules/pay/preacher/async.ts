import { pget, ppost } from "utils/request";

export function loadPreacherNumber(param) {
  return ppost('/rise/preacher/number', param);
}

