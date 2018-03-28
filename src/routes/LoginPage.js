import {Component} from 'react';
import { Form,Icon,Input,Button,Spin,Checkbox,Modal } from 'antd';
import {observer} from 'mobx-react';
import LoginStore from '../stores/LoginStore';
import PublicAuthKit from '../utils/PublicAuthKit';
import ForgetPasswordContent from '../components/login/ForgetPasswordContent';

import loginStyles from "../assets/css/loginPage.css";
const board = require('../assets/images/board.png');
const projectName = require('../assets/images/project-name.png');
const FormItem = Form.Item;

// const openNotification = (description) => {
//   notification.open({
//     message: '消息提示：',
//     description: description,
//   });
// };


@observer
class LoginPage extends Component{
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        LoginStore.setMaskLoadingStatus(true);
        LoginStore.getTokenFromWebServer(values).then(response => {
          if(response){
            /* 检查是否需要记住密码 */
            if(values['remember']){
              PublicAuthKit.setItemIntoLocalStorage('username',values['username']);
              PublicAuthKit.setItemIntoLocalStorage('password',values['password']);
            }else{
              PublicAuthKit.removeItemFromLocalStorage('username');
              PublicAuthKit.removeItemFromLocalStorage('password');
            }

            LoginStore.LoginSuccess(response.data.token,values);
            this.props.history.push("/home");
            LoginStore.setMaskLoadingStatus(false);
          }
        });
      }
    });
  }

  handleOnRegister = ()=>{
    this.props.history.push("/register");
  }


  render(){
    const { getFieldDecorator } = this.props.form;
    return (
      <Spin spinning={LoginStore.getMaskLoadingStatus} size='large'
            className="spin-mask">
        <Modal
          title="忘记密码"
          visible={LoginStore.getShowForgetPasswordModal}
          footer={null}
          onCancel={()=>{
            LoginStore.setShowChangePasswordModal(false);
            LoginStore.setCurrentStep(0);
          }}
        >
          <ForgetPasswordContent/>
        </Modal>


        <div className={loginStyles["login-page"]}>
          <div style={{marginBottom:'6%'}}>
            <img src={board} alt='board logo' style={{width: '19%'}}/>
            <img src={projectName} alt='project name' style={{width: '77%', marginLeft: '4%', marginTop: '4%'}}/>
          </div>
          <Form onSubmit={this.handleSubmit} className={loginStyles["login-form"]}>
            <FormItem>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '请输入用户名!' }],
                valuePropName:'value',
                initialValue:PublicAuthKit.getItemFromLocalStorage('username')
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码!' }],
                valuePropName:'value',
                initialValue:PublicAuthKit.getItemFromLocalStorage('password')
              })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: (PublicAuthKit.getItemFromLocalStorage('username')&&
                  PublicAuthKit.getItemFromLocalStorage('password'))?true:false,
              })(
                <Checkbox>记住用户名和密码</Checkbox>
              )}
              <a className={loginStyles["login-form-forgot"]} href="javascript:void(0)" onClick={()=>{
                LoginStore.setShowChangePasswordModal(true);
              }}><Icon type="question-circle-o" style={{color:'#01368a'}} />&ensp;忘记密码</a>
              <Button type="primary" htmlType="submit" className={loginStyles["login-form-button"]}>
                登陆
              </Button>

              <Button className={loginStyles["register-form-button"]} onClick={this.handleOnRegister}>
                立即注册
              </Button>
            </FormItem>
          </Form>
        </div>
        <hr style={{borderTop: '1px solid #eee'}}/>
        <div style={{display: 'flex',
          flexFlow: 'column nowrap',
          alignItems: 'center',
          marginTop:30}}>
          <div>基于React敏捷看板&emsp;©2018 陈真</div>
          <div>技术支持：chazen@qq.com</div>
        </div>
      </Spin>
    );
  }
}

export default Form.create()(LoginPage);
