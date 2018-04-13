import {Component} from 'react'
import {Modal,Form,Spin,Input,message} from 'antd';
import ProjectStore from "../../stores/ProjectStore";
import {observer} from 'mobx-react';

const FormItem = Form.Item;
@observer
class CreateKanbanModal extends Component{
  render(){
    const { getFieldDecorator } = this.props.form;
    const projectInfo = ProjectStore.getProjectInfo;
    // const sprintId = ProjectStore.getTargetSprintId;
    // const sprints = ProjectStore.getSprints;
    // let targetSprint = null;
    // for(let item of sprints){
    //   if(item.sprintId===sprintId){
    //     targetSprint = item;
    //     break;
    //   }
    // }
    return (
      <Modal
        title="新建看板"
        visible={ProjectStore.getShowCreateKanbanModal}
        destroyOnClose={true}
        okText='确定'
        cancelText='取消'
        onCancel={()=>{
          ProjectStore.setShowCreateKanbanModal(false);
        }}
        onOk={()=>{
          this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
              ProjectStore.setCreateKanbanMaskLoadingStatus(true);

              const kanban = {};
              kanban['kanbanName'] = values.kanbanName;
              kanban['kanbanDescription'] = values.kanbanDescription;

              kanban['projectId'] = projectInfo.projectId;
              kanban['kanbanHeight'] = 5;

              ProjectStore.createKanban(kanban).then(response=>{
                if(response){
                  if(response.data==='success'){
                    /* 创建成功后需要刷新数据源 */
                    ProjectStore.getKanbansFromWebServer(projectInfo.projectId).then(response=>{
                      ProjectStore.setCreateKanbanMaskLoadingStatus(false);
                      if(response){
                        ProjectStore.setShowCreateKanbanModal(false);
                        message.success('创建成功');
                        ProjectStore.setKanbans(response.data);
                        // HomeStore.setProjectsBackUp(response.data);
                      }else{
                        message.error('网络错误，请稍后再试！');
                      }
                    });
                  }else if(response.data==='failure'){
                    message.error('创建失败，请稍后再试！');
                    ProjectStore.setCreateKanbanMaskLoadingStatus(false);
                  }
                }else{
                  ProjectStore.setCreateKanbanMaskLoadingStatus(false);
                  message.error('网络错误，请稍后再试！');
                }
              });
            }
          });
        }}
      >
        <Spin size='large' className="spin-mask" spinning={ProjectStore.getCreateKanbanMaskLoadingStatus}>
          <Form>
            <FormItem
              label="任务类型"
              hasFeedback>
              {getFieldDecorator('kanbanName', {
                rules: [{ required: true, message: '请输入看板名称！'}],
              })(
                <Input placeholder="请输入看板名称" />
              )}
            </FormItem>
            <FormItem
              label="看板描述"
              hasFeedback>
              {getFieldDecorator('kanbanDescription', {
                rules: [{ required: true, message: '请输入看板描述！' }],
              })(
                <Input.TextArea placeholder="请输入看板描述" autosize={false} rows={4}/>
              )}
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    );
  }
}

export default Form.create()(CreateKanbanModal);
