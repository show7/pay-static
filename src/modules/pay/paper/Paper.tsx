import * as React from 'react'
import './paper.less'
import AssetImg from '../../../components/AssetImg'
import {mark} from '../../../utils/request'
import {getQuery} from '../../../utils/getQuery'
import {changeTitle} from '../../../utils/helpers'

export default class Paper extends React.Component<any, any> {
  constructor() {
    super()
    this.state = {
      pageMap: [
        {
          memo: '又更新了2019/03/14',
          imgUrl: 'https://static.iqycamp.com/WechatIMG340-btsn0equ.jpeg',
        },
        {
          memo: '又更新了2019/03/15',
          imgUrl: 'https://static.iqycamp.com/3-15-jz3m47tj.jpg',
        },
      ],
      currentPage: {},
    }
  }

  componentWillMount() {
    changeTitle('又更新了')
    const {pageMap} = this.state
    const currentPage = pageMap[getQuery('pageType')] || pageMap[0]
    this.setState({
      currentPage,
    })
    mark({
      module: '曝光点',
      function: '又更新了日报',
      action: currentPage.memo,
      memo: window.location.href,
    })
  }
  render() {
    const {currentPage} = this.state
    return (
      <div className="paper-component-wrap">
        <AssetImg url={currentPage.imgUrl} width="100%" />
      </div>
    )
  }
}
