import {Component} from 'react'
import {Modal,Form,Spin,Input,message} from 'antd';
import ProjectStore from "../../stores/ProjectStore";
import {observer} from 'mobx-react';

const FormItem = Form.Item;
@observer
class EditKanbanModal extends Component{
  render(){
    const { getFieldDecorator } = this.props.form;
    const projectInfo = ProjectStore.getProjectInfo;

    const targetKanban = ProjectStore.getTargetKanban;
    return (
      <Modal
        title="编辑看板"
        visible={ProjectStore.getShowEditKanbanModal}
        destroyOnClose={true}
        okText='确定'
        cancelText='取消'
        onCancel={()=>{
          ProjectStore.setShowEditKanbanModal(false);
        }}
        onOk={()=>{
          this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
              ProjectStore.setEditKanbanMaskLodingStatus(true);

              const kanban = {};
              kanban['kanbanName'] = values.kanbanName;
              kanban['kanbanDescription'] = values.kanbanDescription;
              kanban['projectId'] = projectInfo.projectId;
              kanban['kanbanId'] = targetKanban.kanbanId;

              ProjectStore.updateKanban(kanban).then(response=>{
                if(response){
                  if(response.data==='success'){
                    /* 创建成功后需要刷新数据源 */
                    ProjectStore.getKanbansFromWebServer(projectInfo.projectId).then(response=>{
                      ProjectStore.setEditKanbanMaskLodingStatus(false);
                      if(response){
                        ProjectStore.setShowEditKanbanModal(false);
                        message.success('修改成功');
                        ProjectStore.setKanbans(response.data);
                        // HomeStore.setProjectsBackUp(response.data);
                      }else{
                        message.error('网络错误，请稍后再试！');
                      }
                    });
                  }else if(response.data==='failure'){
                    message.error('修改失败，请稍后再试！');
                    ProjectStore.setEditKanbanMaskLodingStatus(false);
                  }
                }else{
                  ProjectStore.setEditKanbanMaskLodingStatus(false);
                  message.error('网络错误，请稍后再试！');
                }
              });
            }
          });
        }}
      >
        <Spin size='large' className="spin-mask" spinning={ProjectStore.getEditKanbanMaskLodingStatus}>
          <Form>
            <FormItem
              label="任务类型"
              hasFeedback>
              {getFieldDecorator('kanbanName', {
                rules: [{ required: true, message: '请输入看板名称！'}],
                initialValue:targetKanban.kanbanName
              })(
                <Input placeholder="请输入看板名称" />
              )}
            </FormItem>
            <FormItem
              label="看板描述"
              hasFeedback>
              {getFieldDecorator('kanbanDescription', {
                rules: [{ required: true, message: '请输入看板描述！' }],
                initialValue:targetKanban.kanbanDescription
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

export default Form.create()(EditKanbanModal);
