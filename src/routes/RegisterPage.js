import {Component} from 'react';
import {Form,Input,Select} from 'antd';
import RegisterStore from '../stores/RegisterStore';
import Config from "../utils/Config";
import AuthUpload from "../components/register/AuthUpload";

const FormItem = Form.Item;

class RegisterPage extends Component{
  state = {
    confirmDirty: false,
  };

  handleOnSubmit = ()=>{
    console.log('提交了');
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
      callback('两次密码输入不相同，请重新输入!');
    } else {
      callback();
    }
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  validateUsername = (rule, value, callback) =>{
    RegisterStore.checkUsernameFromWebServer(value).then(response => {
      if(response){
        if(response.data==="have"){
          callback("用户名已存在，请重新输入！");
        }else if(response.data==="not-have"){
          callback();
        }
      }
    });
  }

  render(){

    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleOnSubmit}>
        <FormItem>
          <AuthUpload/>
        </FormItem>
        <FormItem
          label="邮箱地址">
          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: '当前邮箱地址不合法！',
            }, {
              required: true, message: '请输入您的邮箱地址！',
            }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          label="用户名"
          hasFeedback>
          {getFieldDecorator('username', {
            rules: [{
              required: true, message: '请输入用户名！',
            },{
              validator: this.validateUsername
            }],
          })(
            <Input id="success"/>
          )}
        </FormItem>
        <FormItem
          label="用户密码"
          hasFeedback
        >
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: '请输入您的密码!',
            }, {
              validator: this.validateToNextPassword,
            }],
          })(
            <Input type="password" />
          )}
        </FormItem>
        <FormItem
          label="确认密码"
          hasFeedback
        >
          {getFieldDecorator('confirm', {
            rules: [{
              required: true, message: '请确认您的密码!',
            }, {
              validator: this.compareToFirstPassword,
            }],
          })(
            <Input type="password" onBlur={this.handleConfirmBlur} />
          )}
        </FormItem>
        <FormItem
          label="密保问题"
        >
          {getFieldDecorator('secretQuestion', {
            rules: [
              { required: true, message: '请选择密保问题!' },
            ],initialValue:0
          })(
            <Select>
              <Select.Option value={0}>{Config.secretQuestion[0]}</Select.Option>
              <Select.Option value={1}>{Config.secretQuestion[1]} </Select.Option>
              <Select.Option value={2}>{Config.secretQuestion[2]} </Select.Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          label="密保答案"
        >
          {getFieldDecorator('secretQuestionAnswer', {
            rules: [
              { required: true, message: '请输入密保答案!' },
            ]
          })(
            <Input />
          )}
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(RegisterPage);
