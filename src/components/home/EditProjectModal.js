import {Component} from 'react'
import {Modal,Form,Spin,Input,message} from 'antd';
import HomeStore from "../../stores/HomeStore";
import {observer} from 'mobx-react';
import PublicAuthKit from '../../utils/PublicAuthKit';

const FormItem = Form.Item;

@observer
class EditProjectModal extends Component{
  render(){
    const { getFieldDecorator } = this.props.form;

    let projects = HomeStore.getProjects;
    /* 修改项目start */
    let editProjectId = HomeStore.getEditTargetProjectId;
    let targetEditProject = {};
    for(let editProject of projects){
      if(editProject['projectId']===editProjectId){
        targetEditProject = editProject;
        break;
      }
    }
    let editProjectName = targetEditProject['projectName']==null?' ':targetEditProject['projectName'];
    let editProjectDescription = targetEditProject['projectDescription']==null?' ':targetEditProject['projectDescription'];
    /* 修改项目end */

    return (
      <Modal
        title="修改项目"
        visible={HomeStore.getShowEditTargetProjectModal}
        destroyOnClose={true}
        okText='确定'
        cancelText='取消'
        onCancel={()=>{
          HomeStore.setShowEditTargetProjectModal(false);
        }}
        onOk={()=>{
          this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
              HomeStore.setEditProjectMaskLoadingStatus(true);
              let project = {};
              project['projectId'] = editProjectId;
              project['projectName'] = this.props.form.getFieldValue('projectName');
              project['projectDescription'] = this.props.form.getFieldValue('projectDescription');
              HomeStore.updateProject(project,PublicAuthKit.getItem('username')).then(response=>{
                if(response){
                  if(response.data==='success'){
                    /* 创建成功后需要刷新数据源 */
                    HomeStore.getProjectFromWebServer(PublicAuthKit.getItem('username')).then(response=>{
                      HomeStore.setEditProjectMaskLoadingStatus(false);
                      if(response){
                        HomeStore.setShowEditTargetProjectModal(false);
                        message.success('修改成功');
                        HomeStore.setProjects(response.data);
                        HomeStore.setProjectsBackUp(response.data);
                      }else{
                        message.error('网络错误，请稍后再试！');
                      }
                    });
                  }else if(response.data==='failure'){
                    message.error('修改失败，请稍后再试！');
                  }
                }else{
                  HomeStore.setEditProjectMaskLoadingStatus(false);
                  message.error('网络错误，请稍后再试！');
                }
              });
            }
          });
        }}
      >
        <Spin size='large' className="spin-mask" spinning={HomeStore.getEditProjectMaskLoadingStatus}>
          <Form>
            <FormItem
              label="项目名称"
              hasFeedback>
              {getFieldDecorator('projectName', {
                rules: [{ required: true, message: '请输入项目名称！' }],
                initialValue: editProjectName
              })(
                <Input placeholder="请输入项目名称"/>
              )}
            </FormItem>
            <FormItem
              label="项目描述"
              hasFeedback>
              {getFieldDecorator('projectDescription', {
                rules: [{ required: true, message: '请输入项目描述！' }],
                initialValue:editProjectDescription
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

export default Form.create()(EditProjectModal);
