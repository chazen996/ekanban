import {Component} from 'react';
import Navigator from './Navigator';
import {Modal,Form,Input,message,Spin,Button} from 'antd';
import {observer} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import PublicAuthKit from "../../utils/PublicAuthKit";
import headStyles from "../../assets/css/header.css";
import UserAvatar from "./UserAvatar";
import HomeStore from "../../stores/HomeStore";
import ImgUpload from "../home/ImgUpload";

const board = require('../../assets/images/board-vertical.png');
const projectName = require('../../assets/images/project-name.png');
const FormItem = Form.Item;

const targetUser = {};
@observer
class Header extends Component{
  constructor(props){
    super(props);
    this.state = {
      confirmDirty: false,
    };
  }


  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次密码输入不同!');
    } else {
      callback();
    }
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  handleOnLogOut = ()=>{
    message.success('注销成功！');
    /* 清除登陆信息并将页面重定向到login页面;清除token信息（header无需移除，每个store的header需要自行重新设置） */
    PublicAuthKit.removeItem('username');
    PublicAuthKit.removeItem('loginStatus');
    PublicAuthKit.removeItem('token');

    this.props.history.push("/login");
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const userInfo = HomeStore.getUserInfo;
    return(
      <div className={headStyles["header-container"]}>
        <img src={board} alt='board logo' style={{height: '72%',marginLeft:'3%',userSelect:'none'}}/>
        <img src={projectName} alt='project name' style={{height:'65%',marginLeft:'1%',userSelect:'none'}}/>
        <Navigator naviData={this.props.naviData}/>
        <UserAvatar username={PublicAuthKit.getItem('username')} handleOnLogOut={this.handleOnLogOut}/>


        <Modal
          title="修改密码"
          visible={HomeStore.getShowChangePasswordModal}
          okText="确认"
          cancelText="取消"
          onCancel={()=>{
            HomeStore.setShowChangePasswordModal(false);
          }}
          destroyOnClose={true}
          onOk={()=>{
            this.props.form.validateFieldsAndScroll((err, values) => {
              if(!err){
                targetUser["username"] = PublicAuthKit.getItem('username');
                targetUser["password"] = this.props.form.getFieldValue('password')
                const oldPassword = this.props.form.getFieldValue('oldPassword');
                HomeStore.updatePassword(targetUser,oldPassword).then(response=>{
                  if(response){
                    if(response.data==='success'){
                      message.success('修改成功！');
                      HomeStore.setShowChangePasswordModal(false);
                      this.handleOnLogOut();
                    }else if(response.data==='failure'){
                      message.error('密码输入有误，请稍后再试！');
                    }
                  }else{
                    message.error('网络错误，请稍后再试！');
                  }
                });
              }
            });
          }}
        >
          <Form>
            <FormItem
              label="旧密码"
              hasFeedback>
              {getFieldDecorator('oldPassword', {
                rules: [
                  { required: true, message: '请输入旧密码！' },
                ]
              })(
                <Input type="password" placeholder="请输入旧密码"/>
              )}
            </FormItem>
            <FormItem
              label="新密码"
              hasFeedback>
              {getFieldDecorator('password', {
                rules: [{
                  required: true, message: '请输入您的密码!',
                }, {
                  validator: this.validateToNextPassword,
                },{
                  min:6,message:'密码长度至少6位',
                }],
              })(
                <Input type="password" placeholder="不少于6位数的密码" />
              )}
            </FormItem>
            <FormItem
              label="确认密码"
              hasFeedback>
              {getFieldDecorator('confirm', {
                rules: [{
                  required: true, message: '请确认您的密码!',
                }, {
                  validator: this.compareToFirstPassword,
                }],
              })(
                <Input type="password" onBlur={this.handleConfirmBlur} placeholder="不少于6位数的密码" />
              )}
            </FormItem>
          </Form>
        </Modal>

        <Modal
          title="个人信息"
          visible={HomeStore.getShowPersonalInfoModal}
          footer={null}
          onCancel={()=>{
            HomeStore.setShowPersonalInfoModal(false);
          }}
          destroyOnClose={true}
          onOk={()=>{
            this.props.form.validateFieldsAndScroll((err, values) => {
              if(!err){
                targetUser["username"] = PublicAuthKit.getItem('username');
                targetUser["password"] = this.props.form.getFieldValue('password')
                const oldPassword = this.props.form.getFieldValue('oldPassword');
                HomeStore.updatePassword(targetUser,oldPassword).then(response=>{
                  if(response){
                    if(response.data==='success'){
                      message.success('修改成功！');
                      HomeStore.setShowChangePasswordModal(false);
                      this.handleOnLogOut();
                    }else if(response.data==='failure'){
                      message.error('密码输入有误，请稍后再试！');
                    }
                  }else{
                    message.error('网络错误，请稍后再试！');
                  }
                });
              }
            });
          }}
        >
          <Spin spinning={HomeStore.getUserInfoMaskLoadingStatus}>
            <div>
              <ImgUpload username={PublicAuthKit.getItem('username')}/>
              <div>
                <span>用户名:&ensp;</span><span>{userInfo['username']}</span>
              </div>
              <div>
                <span>邮箱:&ensp;</span><span>{userInfo['emailAddress']}</span>
              </div>
              <div>
                <span>上次密码修改时间:&ensp;</span><span>{userInfo['lastPasswordResetDate']}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: 24
              }}>
                <Button style={{marginRight: 24}} onClick={()=>{
                  HomeStore.setShowPersonalInfoModal(false);
                  HomeStore.setPersonalInfoButtonDisabled(true);
                }}>
                  取消
                </Button>
                <Button type='primary' disabled={HomeStore.getPersonalInfoButtonDisabled} onClick={()=>{
                  HomeStore.changeUserAvatar(PublicAuthKit.getItem('username')).then(response=>{
                    if(response){
                      if(response.data==='success'){
                        message.success('头像修改成功！');
                        HomeStore.setShowPersonalInfoModal(false);
                        setTimeout(window.location.reload(),2000);
                      }else{
                        message.error('头像修改失败，请稍后重试！');
                      }
                    }else{
                      message.error('网络错误，请稍后重试！');
                    }
                  });
                }}>
                  确认
                </Button>
              </div>
            </div>
          </Spin>
        </Modal>
      </div>
    );
  }

}
export default withRouter(Form.create()(Header));
