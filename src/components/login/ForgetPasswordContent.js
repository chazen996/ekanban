import { Steps, Button,Form,Input,Icon,Select,message } from 'antd';
import {observer} from 'mobx-react';
import {Component} from 'react';
import Config from "../../utils/Config";
import LoginStore from "../../stores/LoginStore";

require("../../assets/css/loginPage.css");

const Step = Steps.Step;
const FormItem = Form.Item;

const targetUser = {};

@observer
class ForgetPasswordContent extends Component {
  constructor(props) {
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

  validateUsername = (rule, value, callback) =>{
    LoginStore.checkUsernameFromWebServer(value).then(response => {
      if(response){
        if(response.data==="have"){
          callback();
        }else if(response.data==="not-have"){
          callback("用户名不存在！");
        }
      }else{
        callback("网络异常，无法确认用户名是否有效，请稍后重试！");
      }
    });
  }

  validateSecretQuestion = (rule, value, callback)=>{

    targetUser["secretQuestion"] = this.props.form.getFieldValue('secretQuestion');
    targetUser["secretQuestionAnswer"] = this.props.form.getFieldValue('secretQuestionAnswer');

    LoginStore.confirmUserIdentity(targetUser).then(response=>{
      if(response){
        if(response.data==='success'){
          callback();
        }else if(response.data==='failure'){
          callback('密保错误，请仔细核对相关输入！');
        }
      }else{
        callback('网络异常，无法确认密保问题是否有效，请稍后重试！');
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const current = LoginStore.getCurrentStep;
    let formContent;
    if(current===0){
      formContent = (
        <Form>
          <FormItem
            label="用户名"
            hasFeedback>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: '请输入用户名！' },
                {
                  validator: this.validateUsername
                }],validateFirst:true
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
            )}
          </FormItem>
          <FormItem style={{
            marginBottom:0
          }}>
            <Button type="primary" onClick={()=>{
              this.props.form.validateFieldsAndScroll((err, values) => {
                if(!err){
                  targetUser['username'] = this.props.form.getFieldValue('username');
                  // this.setState({
                  //   current:this.state.current+1,
                  // });
                  LoginStore.setCurrentStep(1);
                }
              });
            }}>
              下一步
            </Button>
          </FormItem>
        </Form>
      );
    }else if(current===1){
      formContent = (
        <Form>
          <FormItem
            label="密保问题"
            hasFeedback>
            {getFieldDecorator('secretQuestion', {
              rules: [{ required: true, message: '请选择密保问题！' }],
              initialValue:0,
            })(
              <Select onChange={(value)=>{
                this.props.form.resetFields(['secretQuestionAnswer']);
              }}>
                <Select.Option value={0}>{Config.secretQuestion[0]}</Select.Option>
                <Select.Option value={1}>{Config.secretQuestion[1]} </Select.Option>
                <Select.Option value={2}>{Config.secretQuestion[2]} </Select.Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            label="密保答案"
            hasFeedback>
            {getFieldDecorator('secretQuestionAnswer', {
              rules: [
                { required: true, message: '请输入密保答案!' },{
                  validator:this.validateSecretQuestion
                }
              ],validateFirst:true
            })(
              <Input placeholder="请输入您的密保信息"/>
            )}
          </FormItem>
          <FormItem style={{
            marginBottom:0
          }}>
            <Button type="primary" onClick={()=>{
              this.props.form.validateFieldsAndScroll((err, values) => {
                if(!err){
                  LoginStore.setCurrentStep(2);
                }
              });
            }}>
              下一步
            </Button>
          </FormItem>
        </Form>
      );
    }else if(current===2){
      formContent = (
        <Form>
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
          <FormItem style={{
            marginBottom:0
          }}>
            <Button type="primary" onClick={()=>{
              this.props.form.validateFieldsAndScroll((err, values) => {
                if(!err){
                  LoginStore.setConfirmChangePasswordButtonLoadingStatus(true);
                  targetUser["password"]=this.props.form.getFieldValue('password');
                  LoginStore.updatePasswordWithSecretQuestion(targetUser).then(response=>{
                    LoginStore.setConfirmChangePasswordButtonLoadingStatus(false);
                    if(response){
                      if(response.data==='success'){
                        message.success('修改成功！');
                        LoginStore.setShowChangePasswordModal(false);
                        LoginStore.setCurrentStep(0);
                      }else if(response.data==='failure'){
                        message.error('修改失败！');
                      }
                    }else{
                      message.error('网络错误，请稍后再试！');
                    }
                  });
                }
              });
            }} loading={LoginStore.getConfirmChangePasswordButtonLoadingStatus}>
              确认修改
            </Button>
          </FormItem>
        </Form>
      );
    }

    return (
      <div>
        <Steps current={current}>
          <Step title='确认用户' />
          <Step title='验证身份' />
          <Step title='修改密码' />
        </Steps>
        <div className="steps-content" style={{
          marginTop:'2%'
        }}>
          {formContent}
        </div>
      </div>
    );
  }
}
export default Form.create()(ForgetPasswordContent);
