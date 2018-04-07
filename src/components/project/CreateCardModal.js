import {Component} from 'react'
import {Modal,Form,Spin,Input,message} from 'antd';
import ProjectStore from "../../stores/ProjectStore";
import {observer} from 'mobx-react';
import CardType from './CardType';

const FormItem = Form.Item;
@observer
class CreateCardModal extends Component{
  render(){
    const { getFieldDecorator } = this.props.form;
    const projectInfo = ProjectStore.getProjectInfo;
    const sprintId = ProjectStore.getTargetSprintId;
    const sprints = ProjectStore.getSprints;
    let targetSprint = null;
    for(let item of sprints){
      if(item.sprintId===sprintId){
        targetSprint = item;
        break;
      }
    }
    return (
      <Modal
        title="新建任务"
        visible={ProjectStore.getShowCreateCardModal}
        destroyOnClose={true}
        okText='确定'
        cancelText='取消'
        onCancel={()=>{
          ProjectStore.setShowCreateCardModal(false);
        }}
        onOk={()=>{
          this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
              ProjectStore.setCreateCardMaskLoadingStatus(true);

              const card = {};
              card['cardType'] = ProjectStore.getCardTypeChecked;
              card['cardContent'] = values['cardContent'];
              if(ProjectStore.getCardTypeChecked==='other'){
                card['cardDescription'] = values['cardContent'];
              }
              card['sprintId'] = targetSprint.sprintId;
              card['projectId'] = projectInfo.projectId;
              if(targetSprint.sprintStatus==='closed'){
                card['cardStatus']='freezed';
              }else{
                card['cardStatus']='pretodo';
              }

              ProjectStore.createCard(card).then(response=>{
                if(response){
                  if(response.data==='success'){
                    /* 创建成功后需要刷新数据源 */
                    ProjectStore.getSprintsFromWebServer(projectInfo.projectId).then(response=>{
                      ProjectStore.setCreateCardMaskLoadingStatus(false);
                      if(response){
                        ProjectStore.setShowCreateCardModal(false);
                        message.success('创建成功');
                        ProjectStore.setSprints(response.data);
                        // HomeStore.setProjectsBackUp(response.data);
                      }else{
                        message.error('网络错误，请稍后再试！');
                      }
                    });
                  }else if(response.data==='failure'){
                    message.error('创建失败，请稍后再试！');
                    ProjectStore.setCreateCardMaskLoadingStatus(false);
                  }
                }else{
                  ProjectStore.setCreateCardMaskLoadingStatus(false);
                  message.error('网络错误，请稍后再试！');
                }
              });
            }
          });
        }}
      >
        <Spin size='large' className="spin-mask" spinning={ProjectStore.getCreateCardMaskLoadingStatus}>
          <Form>
            <FormItem
              label="任务类型">
              <CardType />
            </FormItem>
            {ProjectStore.getCardTypeChecked==='other'?(
              <FormItem
                label="类型描述"
                hasFeedback>
                {getFieldDecorator('cardDescription', {
                  rules: [{ required: true, message: '请输入自定义类型名称！'}],
                })(
                  <Input placeholder="请输入自定义类型名称" />
                )}
              </FormItem>
            ):(null)}
            <FormItem
              label="任务详情"
              hasFeedback>
              {getFieldDecorator('cardContent', {
                rules: [{ required: true, message: '请输入任务详情！' }],
              })(
                <Input.TextArea placeholder="请输入任务详情" autosize={false} rows={4}/>
              )}
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    );
  }
}

export default Form.create()(CreateCardModal);
