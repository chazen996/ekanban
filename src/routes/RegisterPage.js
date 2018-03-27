import {Component} from 'react';
import {observer} from 'mobx-react';
import {Form,Input,Select,Row, Col,Button,message,Spin,Icon} from 'antd';
import RegisterStore from '../stores/RegisterStore';
import Config from "../utils/Config";
import ImgUpload from "../components/register/ImgUpload";
import PublicAuthKit from "../utils/PublicAuthKit";
require("../assets/css/registerPage.css");

const meeting = require('../assets/images/meeting.png');
const FormItem = Form.Item;

@observer
class RegisterPage extends Component{

  constructor(props){
    super(props);
    this.state = {
      confirmDirty: false,
      buttonDisabled:false
    };

    this.imgTempName = {
      'img-temp-name':PublicAuthKit.generateNoneDuplicateID(3)
    };
  }

  componentDidMount(){
    // alert("我被执行了");
    this.resizeBodyContent();
    window.onresize = () => {
      this.resizeBodyContent();
    };
  }

  componentWillUnmount(){
    window.onresize = null;
  }

  resizeBodyContent=()=>{
    const bodyContainer = document.querySelector(".body-container");
    const header = document.querySelector("#header");
    bodyContainer.style.height = `${window.innerHeight - header.offsetHeight}px`;
  }

  handleOnSubmit = (e)=>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const registerUser = {
          'username':values.username,
          'password':values.password,
          'emailAddress':values.emailAddress,
          'secretQuestion':values.secretQuestion,
          'secretQuestionAnswer':values.secretQuestionAnswer
        };
        RegisterStore.setRegisterLoading(true);
        RegisterStore.registerUser(registerUser,this.imgTempName["img-temp-name"]).then(response=>{
          RegisterStore.setRegisterLoading(false);
          this.setState({
            buttonDisabled:true
          });
          if(response&&response.data){
            message.success("注册成功！");
            this.props.history.push('/login');
          }else{
            message.error("注册失败,请重新尝试！");
            setTimeout(window.location.reload(),1500);
          }
        });
      }else{
        message.error("请正确填写表单！");
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
    if(value==null||value===""){
      callback();
    }else{
      RegisterStore.checkUsernameFromWebServer(value).then(response => {
        if(response){
          if(response.data==="have"){
            callback("用户名已存在，请重新输入！");
          }else if(response.data==="not-have"){
            callback();
          }
        }else{
          callback("网络异常，无法确认用户名是否有效，请稍后重试！");
        }
      });
    }
  }

  render(){
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { getFieldDecorator } = this.props.form;

    return (
      <Spin size='large' spinning={RegisterStore.getRegisterLoading} className="spin-mask">
        <div style={{
          height: 64,
          boxShadow: "0 2px 8px #f0f1f2",
          display: 'flex',
          flexFlow: 'row',
          alignItems: 'center'
        }} id="header">

          <Icon type="arrow-left" style={{
            fontSize:26,
            color: '#6fb1f9',
            marginLeft:'1%',
            cursor:'pointer'
          }} onClick={()=>{
            this.props.history.push('/login');
          }}/>
          <div style={{
            color: '#6fb1f9',
            fontSize: 18,
            fontWeight: 300,
            marginLeft: '1%',
            border: '1px solid #cae0f9',
            padding: '4px 8px'
          }}>注册新用户</div>

        </div>

        <div className="body-container">
          <div style={{
            width:847,
            display:'inline-block',
            marginTop:78
          }}>
            <img src={meeting} alt="" style={{
              width: 550,
              marginLeft: '18%'
            }} />
          </div>
          <div style={{
            width:492,
            verticalAlign: 'top',
            display:'inline-block',
            marginTop:30
          }}>
            <Form onSubmit={this.handleOnSubmit}>
              <FormItem style={{marginBottom:12}}>
                <Row>
                  <Col offset={16}><ImgUpload imgTempName={this.imgTempName}/></Col>
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
                  <Col offset={3} span={16}>
                    <Button type="primary" htmlType="submit" style={{width:'100%'}}
                            loading={RegisterStore.getRegisterLoading} disabled={this.state.buttonDisabled}>立即注册</Button>
                  </Col>
                </Row>
              </FormItem>
            </Form>
          </div>
        </div>
      </Spin>
    );
  }
}

export default Form.create()(RegisterPage);
