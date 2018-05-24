/*++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. 项目名称：pay-static
2. 文件功能：优惠券弹框
3. 作者：liyang@iquanwai.com
4. 备注：{ oldNickName, //邀请人
         prijectName ,  // 项目名称
          amount ,    //优惠金额
           callBack    // 回调函数
           }
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
import * as React from 'react';
import "./InvitationLayout.less";

export default class InvitationLayout extends React.Component {
    constructor() {
        super();
        this.state = {

        }
    }

    render(){
        const { oldNickName,prijectName , amount ,callBack} = this.props
        return (
            <div className="invitation-layout">
                <div className="layout-box">
                    <h3>好友邀请</h3>
                    <p>{oldNickName}觉得《{prijectName}》很适合你，邀请你成为TA的同学，送你一张{amount}元的学习优惠券。</p>
                    <span className="button" onClick={callBack}>知道了</span>
                </div>
            </div>
        )
    }
}