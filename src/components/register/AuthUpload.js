import { Upload, Icon, message } from 'antd';
import {Component} from 'react';
// import registerStyles from '../../assets/css/registerPage.css';
import Config from '../../utils/Config';
require("../../assets/css/registerPage.css");

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('仅支持上传jpg文件!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片大小不能超过2MB!');
  }
  return isJPG && isLt2M;
}

class AuthUpload extends Component {
  state = {
    loading: false,
  };
  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loading: false,
      }));
    }
    if (info.file.status ==='error') {
      message.error('文件上传失败，请检查网络连接!');
      this.setState({
        loading:false,
      });
      return;
    }
  }
  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传头像</div>
      </div>
    );
    const imageUrl = this.state.imageUrl;

    const actionURL = `${Config.baseURL}/auth/uploadimg`;

    // const token = PublicAuthKit.getItem('token');
    // const header = {
    //   'authorization':token
    // }
    return (
      <Upload
        name="avatar"
        data={this.props.paraData}
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action={actionURL}
        // headers={header}
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
        style={{
          width:80,
          height:80
        }}
      >
        {imageUrl ? <img src={imageUrl} alt="user avatar" style={{height:64,width:64}}/> : uploadButton}
      </Upload>
    );
  }
}

export default AuthUpload;
