import React, { Component } from 'react';
import * as _ from 'lodash';
import './UploadComponent.less';
import { uploadImage } from './async'
import Icon from '../Icon'

interface UploadProps {
  handleUploadError?: any
  handleUploadStart?: any,
  handleUploadSuccess?: any,
  successIcon?: boolean,
  uploadedUrl?: any,
  limitSize?: any
}

export class UploadComponent extends Component<UploadProps, any> {
  constructor() {
    super();
    this.state = {};
  }

  componentWillMount() {
  }

  upload(file) {
    const { filed = 'file', handleUploadStart = () => {}, handleUploadSuccess = () => {}, handleUploadError = () => {} } = this.props;
    var formData = new FormData();
    formData.append(filed, file);
    handleUploadStart();
    uploadImage(formData).then((res) => {
      if(res.code === 200) {
        this.setState({ uploadSuccess: true });
        handleUploadSuccess(res.msg.picUrl);
      } else {
        handleUploadError(res.msg);
      }
    }).catch(ex => {
      console.log(ex);
      handleUploadError('上传失败，请稍后再试');
    })

  }

  handleChange(e) {
    const { limitSize, handleUploadErr = () => {} } = this.props;
    var file = e.target.files[ 0 ];
    e.target.value = '';
    if(Math.ceil(file.size / 1024 / 1024) > limitSize) {
      this.handleUploadErr();
      return;
    }
    this.upload(file);
  }

  handleClickUpload() {
    if(this.refs.image) {
      this.refs.image.click();
    }
  }

  render() {
    const { showSuccessIcon = true, uploadedUrl } = this.props;
    if(showSuccessIcon && !!uploadedUrl) {
      // 渲染上传成功的icon
      return (
        <div className="upload-wrapper">
          <Icon type='upload_success_icon' size='44px'/>
          <span className="upload_success-tips">
            上传成功
          </span>
        </div>
      )
    } else {
      return (
        <div className="upload-wrapper" onClick={() => this.handleClickUpload()}>
          <input type="file" ref='image' onChange={(e) => this.handleChange(e)}/>
          <Icon type='upload_icon' size='100%'/>
        </div>
      )
    }

  }
}
