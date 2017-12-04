import { mark } from './request'

// 打点参数类型
interface MarkParams {
  module: string,
  func: string,
  action: string,
  memo?: string
}

function PageMark(markParams: MarkParams) {
  return function decorator(target, name, descriptor) {
    const original = descriptor.value
    if(typeof original === 'function') {
      descriptor.value = function() {
        try {
          const { module, func, action, memo = '' } = markParams
          mark({ module: module, function: func, action: action, memo: memo })
          return null
        } catch(e) {
          throw e
        }
      }
    }
    return descriptor
  }
}

export { PageMark }
