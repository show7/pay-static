import * as React from 'react'
import './paper.less'
import AssetImg from '../../../components/AssetImg'
import {mark} from '../../../utils/request'
import {getQuery} from '../../../utils/getQuery'

export default class paper extends React.Component<any, any> {
  constructor() {
    super()
    this.state = {
      pageMap: {
        1: {
          memo: '又更新了2019/03/14',
          imgUrl: 'https://static.iqycamp.com/WechatIMG340-btsn0equ.jpeg',
        },
        2: {
          memo: '又更新了2019/03/15',
          imgUrl: 'https://static.iqycamp.com/3-15-h7ayqh9b.jpg',
        },
      },
      currentPage: {},
    }
  }

  componentWillMount() {
    document.title = '又更新了'
    const {pageMap} = this.state
    console.log(getQuery('pageType'))
    this.setState(
      {
        currentPage: getQuery('pageType')
          ? pageMap[getQuery('pageType')]
          : pageMap[1],
      },
      () => {
        const {currentPage} = this.state
        mark({
          module: '打点',
          function: '',
          action: window.location.href,
          memo: currentPage.memo,
        })
      }
    )
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
