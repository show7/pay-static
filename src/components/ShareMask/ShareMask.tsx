


import * as React from "react";
import "./ShareMask.less";
import {PayType} from "../../utils/helpers";

export  default  class extends React.Component<any, any>{
    constructor(props) {
        super(props);
        this.state = {}
    }

    render(){
        const { callback = ()=>{} } = this.props;
        return(
            <div className="share-mask" onClick={()=>callback()}>
                <div className="share-mask-box">

                </div>
            </div>
        )
    }
}