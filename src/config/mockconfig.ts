import { MockId } from './localconfig.ts'
let _MockId: any = MockId || void 0
export function getMockId() {
  return _MockId
}
