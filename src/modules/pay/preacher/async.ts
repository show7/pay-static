import { pget, ppost } from "utils/request";

export function loadPreacherNumber(param) {
  return pget('/signup/rise/preacher/number', param);
}

