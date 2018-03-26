import {Component} from 'react';
import {Form,Input,Select,Row, Col,Button,message} from 'antd';
import RegisterStore from '../stores/RegisterStore';
import Config from "../utils/Config";
import AuthUpload from "../components/register/AuthUpload";
import PublicAuthKit from "../utils/PublicAuthKit";

const meeting = require('../assets/images/meeting.png');
const FormItem = Form.Item;

class RegisterPage extends Component{

  constructor(props){
    super(props);
    this.state = {
      confirmDirty: false,
    };

    this.paraData = {
      'data-temp-name':PublicAuthKit.generateNoneDuplicateID(3)
    };
  }

  handleOnSubmit = (e)=>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const registerUser = {
          'username':values.username,
          'password':values.password,
          'emailAddress':values.emailAddress,
          'secretQuestion':values.secretQuestion,
          'secretQuestionAnswer':values.secretQuestionAnswer
        }
        RegisterStore.registerUser(registerUser,this.paraData["data-temp-name"]).then(response=>{
          if(response.data){
            message.success("注册成功！");
            this.props.history.push('/login');
          }
        })
      }
    });
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
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <div style={{
          height: 64,
          boxShadow: "0 2px 8px #f0f1f2",
          display: 'flex',
          flexFlow: 'row',
          alignItems: 'center'
        }}>
          <div style={{
            color: '#6fb1f9',
            fontSize: 18,
            fontWeight: 300,
            marginLeft: '2%'
          }}>注册新用户</div>

        </div>
        <div style={{
          width:'36%',
          marginTop:30
        }}>
          <Form onSubmit={this.handleOnSubmit}>
            <FormItem style={{marginBottom:12}}>
              <Row>
                <Col offset={16}><AuthUpload paraData={this.paraData}/></Col>
              </Row>
            </FormItem>
            <FormItem
              label="用户名"
              hasFeedback
              {...formItemLayout}>
              {getFieldDecorator('username', {
                rules: [{
                  required: true, message: '请输入用户名！',
                },{
                  validator: this.validateUsername
                }]
              })(
                <Input placeholder="请输入用户名"/>
              )}
            </FormItem>
            <FormItem
              label="用户密码"
              hasFeedback
              {...formItemLayout}>
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
              hasFeedback
              {...formItemLayout}>
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
            <FormItem
              label="邮箱地址"
              hasFeedback
              {...formItemLayout}>
              {getFieldDecorator('emailAddress', {
                rules: [{
                  type: 'email', message: '邮箱格式不正确！',
                }, {
                  required: true, message: '请输入邮箱地址！',
                }],
              })(
                <Input placeholder="请输入您的常用邮箱" />
              )}
            </FormItem>
            <FormItem
              label="密保问题"
              hasFeedback
              {...formItemLayout}>
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
              hasFeedback
              {...formItemLayout}>
              {getFieldDecorator('secretQuestionAnswer', {
                rules: [
                  { required: true, message: '请输入密保答案!' },
                ]
              })(
                <Input placeholder="请牢记此项输入，建议使用真实信息"/>
              )}
            </FormItem>
            <FormItem style={{marginBottom:0}}>
              <Row>
                <Col offset={3} span={16}><Button type="primary" onClick={this.handleOnSubmit} style={{width:'100%'}}>立即注册</Button></Col>
              </Row>
            </FormItem>
          </Form>
        </div><div>
          <img src={meeting} alt="" />
        </div>
      </div>
    );
  }
}

export default Form.create()(RegisterPage);
