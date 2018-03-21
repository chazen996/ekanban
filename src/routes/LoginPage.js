import {Component} from 'react';
import { Form,Icon,Input,Button } from 'antd';
import {observer} from 'mobx-react';
import LoginStore from '../stores/LoginStore';

const FormItem = Form.Item;

@observer
class LoginPage extends Component{
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        LoginStore.getTokenFromWebServer(values).then(response => {
          if(response){
            console.log('Token:',response.data.token);
            LoginStore.LoginSuccess(response.data.token,values);
          }
        });
      }
    });
  }

  handleTest = ()=>{
    LoginStore.setLoginStatusTrue();
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: '请输入用户名!' }],
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码!' }],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登陆
            </Button>
          </FormItem>
        </Form>
        <Button onClick={this.handleTest}>点我</Button>
      </div>
    );
  }
}

export default Form.create()(LoginPage);
