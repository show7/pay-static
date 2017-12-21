import React,{Component} from 'react';
import * as _ from 'lodash';
import 'UploadComponent.less';

interface UploadProps {

}

export class UploadComponent extends Component<UploadProps,any>{
  constructor(){
    super();
    this.state = {};
  }

  render(){
    return (
      <div className="upload-wrapper">
        <input type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"/>
      </div>
    )
  }
}
