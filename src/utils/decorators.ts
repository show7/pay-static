import { mark } from './request'

// 打点参数类型
interface MarkParams {
  module: string,
  func: string,
  action: string,
  memo?: string
}

const PageMark = (markParams: MarkParams) => {
  return (target, name, descriptor) => {
    const method = descriptor.value
    descriptor.value = (...args) => {
      let result
      try {
        result = method.apply(target, args)
        const { module, func, action, memo = '' } = markParams
        mark({ module: module, function: func, action: action, memo: memo })
      } catch(e) {
        throw e
      }
      return result
    }
    return descriptor
  }
}

export { PageMark }
