import * as React from 'react'
import { merge, isFunction, forEach, map } from 'lodash'
import AssetImg from '../AssetImg'

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：pay-static
 2. 文件名称：src -> components -> picture -> SequenceDisplay.tsx
 3. 作者：zhenzikang@iquanwai.com
 4. 备注：imgList必传，元素为AssetImg.tsx组件需要的props
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
export default class SequenceDisplay extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
    }
  }

  componentWillMount() {
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    将图片list交给state，因此imgList必须在组件加载时确定
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    const { imgList } = this.props;
    let newImgList = merge([], imgList);
    forEach(newImgList, item => {
      if(!!item.dom) {
        item.loading = false;
      } else {
        item.loading = true;
      }
    })
    this.setState({
      imgList: newImgList
    })
  }

  /*--------------------------------------------------------------------------------------------------------------------
    1.设置加载成功
    2.第一个加载成功的话就触发onLoadFirst回调
   -------------------------------------------------------------------------------------------------------------------*/
  onLoad(item, index, pics) {
    const { onLoadFirst = () => {} } = this.props;
    let newPics = merge([], pics)
    newPics[ index ].loading = false;
    this.setState({ imgList: newPics });
    if(index <= 0) {
      onLoadFirst();
    }
  }

  render() {
    const { imgList = [] } = this.state;
    const renderPics = () => {
      /*--------------------------------------------------------------------------------------------------------------------
        1.第一个必须显示
        2.上一个显示完再加载这一个
      -------------------------------------------------------------------------------------------------------------------*/
      return map(imgList, (item, index, pics) => {
        if(index == 0) {
          if(!!item.dom) {
            // 是一个dom
            return <div key={index}>
              {item.dom}
            </div>;
          } else {
            // 第一个必须显示
            return <AssetImg key={index} onLoad={() => this.onLoad(item, index, pics)} {...item} />
          }
        } else {
          // 获取上一个
          let prePic = pics[ index - 1 ];
          if(!prePic.loading) {
            // 加载完成
            if(!!item.dom) {
              return <div key={index}>
                {item.dom}
              </div>;
            } else {
              return <AssetImg key={index} onLoad={() => this.onLoad(item, index, pics)} {...item}/>
            }
          } else {
            return;
          }
        }
      });
    }

    return (
      <div className="component-sequence-display">
        {renderPics()}
      </div>
    )
  }
}
