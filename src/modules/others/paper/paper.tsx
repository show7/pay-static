import * as React from "react" 
import "./paper.less"
import AssetImg from "../../../components/AssetImg";
import { mark } from "../../../utils/request";
import { getQuery } from "../../../utils/getQuery";
export default class paper extends React.Component<any,any>{
    constructor(){
        super()
        this.state={
            pageMap:{
                1:{
                    memo:'又更新了2019/03/14',
                    imgUrl:'https://static.iqycamp.com/WechatIMG340-btsn0equ.jpeg',
                }
            },
            currentPage:{}

        }
    }

    componentWillMount(){
        const { pageMap } = this.state
        console.log(getQuery('pageType'))
        this.setState({
            currentPage: getQuery('pageType') ? pageMap[getQuery('pageType')] : pageMap[1]
        })
        mark({ module: '打点', function:"", action: window.location.href, memo: '又更新了2019/03/14' })
    }
    render(){
        const { currentPage } = this.state
        return (
            <div className="paper-component-wrap">
                <AssetImg url={currentPage.imgUrl} width='100%'/>
            </div>
        )
    }
}