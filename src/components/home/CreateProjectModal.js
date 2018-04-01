import {Component} from 'react'
import {Modal,Form,Spin,Input,message} from 'antd';
import HomeStore from "../../stores/HomeStore";
import {observer} from 'mobx-react';

const FormItem = Form.Item;

@observer
class CreateProjectModal extends Component{
  render(){
    const { getFieldDecorator } = this.props.form;
    const userInfo = HomeStore.getUserInfo;
    return (
      <Modal
        title="新建项目"
        visible={HomeStore.getShowCreateProjectModal}
        destroyOnClose={true}
        okText='确定'
        cancelText='取消'
        onCancel={()=>{
          HomeStore.setShowCreateProjectModal(false);
        }}
        onOk={()=>{
          this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
              HomeStore.setCreateProjectMaskLoadingStatus(true);

              let username = userInfo['username'];
              const project = {};
              project['projectName'] = this.props.form.getFieldValue('projectName');
              project['projectDescription'] = this.props.form.getFieldValue('projectDescription');
              project['createdBy'] = userInfo['id'];
              HomeStore.createProject(project,username).then(response=>{
                if(response){
                  if(response.data==='success'){
                    /* 创建成功后需要刷新数据源 */
                    HomeStore.getProjectFromWebServer(userInfo.username).then(response=>{
                      HomeStore.setCreateProjectMaskLoadingStatus(false);
                      if(response){
                        HomeStore.setShowCreateProjectModal(false);
                        message.success('创建成功');
                        HomeStore.setProjects(response.data);
                        HomeStore.setProjectsBackUp(response.data);
                      }else{
                        message.error('网络错误，请稍后再试！');
                      }
                    });
                  }else if(response.data==='failure'){
                    message.error('创建失败，请稍后再试！');
                  }
                }else{
                  HomeStore.setCreateProjectMaskLoadingStatus(false);
                  message.error('网络错误，请稍后再试！');
                }
              });
            }
          });
        }}
      >
        <Spin size='large' className="spin-mask" spinning={HomeStore.getCreateProjectMaskLoadingStatus}>
          <Form>
            <FormItem
              label="项目名称"
              hasFeedback>
              {getFieldDecorator('projectName', {
                rules: [{ required: true, message: '请输入项目名称！' }],
              })(
                <Input placeholder="请输入项目名称" />
              )}
            </FormItem>
            <FormItem
              label="项目描述"
              hasFeedback>
              {getFieldDecorator('projectDescription', {
                rules: [{ required: true, message: '请输入项目描述！' }],
              })(
                <Input.TextArea placeholder="请输入项目描述" autosize={false} rows={4}/>
              )}
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    );
  }
}

export default Form.create()(CreateProjectModal);
