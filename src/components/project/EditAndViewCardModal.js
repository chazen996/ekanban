import {Component} from 'react'
import {Modal,Form,Spin,Input,message} from 'antd';
import ProjectStore from "../../stores/ProjectStore";
import CardType from "./CardType";
import {observer} from 'mobx-react';
import Config from "../../utils/Config";

const FormItem = Form.Item;
@observer
class EditAndViewCardModal extends Component{
  render(){
    const { getFieldDecorator } = this.props.form;

    const targetCard = ProjectStore.targetCard;
    const projectInfo = ProjectStore.getProjectInfo;
    const useForEditOrView = ProjectStore.getEditOrView;

    const cardType = (type)=> {

      const typeStyle = {
        borderRadius: 4,
        border: '1px solid',
        width: 50,
        borderColor: Config.cardTypeColor[type],
        background: Config.cardTypeColor[type],
        color: 'white',
        justifyContent: 'center',
        display: 'flex',
        cursor: 'pointer',
        height: 22,
        alignItems: 'center'
      };
      return (
        <div style={typeStyle}>
          <span>{type}</span>
        </div>
      );
    }

    if(useForEditOrView==='edit'){
      return (
        <Modal
          title="编辑任务"
          visible={ProjectStore.getShowEditOrViewCardModal}
          destroyOnClose={true}
          okText='确定'
          cancelText='取消'
          onCancel={()=>{
            ProjectStore.setShowEditOrViewCardModal(false);
          }}
          onOk={()=>{
            this.props.form.validateFieldsAndScroll((err, values) => {
              if(!err){
                ProjectStore.setEditOrViewCardMaskLoadingStatus(true);

                const card = {};
                card.cardId = targetCard.cardId;
                card.cardType = ProjectStore.cardTypeChecked;
                if(card.cardType==='other'){
                  card.cardDescription = values.cardDescription;
                }
                card.cardContent = values.cardContent;
                card.projectId = projectInfo.projectId;

                ProjectStore.updateCard(card).then(response=>{
                  if(response){
                    if(response.data==='success'){
                      /* 创建成功后需要刷新数据源 */
                      ProjectStore.getSprintsFromWebServer(projectInfo.projectId).then(response=>{
                        ProjectStore.setEditOrViewCardMaskLoadingStatus(false);
                        if(response){
                          ProjectStore.setShowEditOrViewCardModal(false);
                          message.success('修改成功！');
                          ProjectStore.setSprints(response.data);
                          // HomeStore.setProjectsBackUp(response.data);
                        }else{
                          message.error('网络错误，请稍后再试！');
                        }
                      });
                    }else if(response.data==='failure'){
                      message.error('修改失败，请稍后再试！');
                      ProjectStore.setEditOrViewCardMaskLoadingStatus(false);
                    }
                  }else{
                    ProjectStore.setEditOrViewCardMaskLoadingStatus(false);
                    message.error('网络错误，请稍后再试！');
                  }
                });
              }
            });
          }}
        >
          <Spin size='large' className="spin-mask" spinning={ProjectStore.getEditOrViewCardMaskLoadingStatus}>
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
                    initialValue:targetCard.cardDescription,
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
                  initialValue:targetCard.cardContent,
                })(
                  <Input.TextArea placeholder="请输入任务详情" autosize={false} rows={4}/>
                )}
              </FormItem>
            </Form>
          </Spin>
        </Modal>
      );
    }else if(useForEditOrView==='view'){
      return (
        <Modal
          title="查看任务"
          visible={ProjectStore.getShowEditOrViewCardModal}
          destroyOnClose={true}
          okText='确定'
          cancelText='取消'
          onCancel={()=>{
            ProjectStore.setShowEditOrViewCardModal(false);
          }}
          footer={null}
        >
          <Spin size='large' className="spin-mask" spinning={false}>
            <Form>
              <FormItem
                label="任务类型">
                {cardType(targetCard.cardType)}
              </FormItem>
              {ProjectStore.getCardTypeChecked==='other'?(
                <FormItem
                  label="类型描述">
                  {getFieldDecorator('cardDescription', {
                    rules: [{ required: true, message: '请输入自定义类型名称！'}],
                    initialValue:targetCard.cardDescription,
                  })(
                    <Input placeholder="请输入自定义类型名称" disabled/>
                  )}
                </FormItem>
              ):(null)}
              <FormItem
                label="任务详情">
                {getFieldDecorator('cardContent', {
                  rules: [{ required: true, message: '请输入任务详情！' }],
                  initialValue:targetCard.cardContent,
                })(
                  <Input.TextArea placeholder="请输入任务详情" autosize={false} rows={4} disabled/>
                )}
              </FormItem>
            </Form>
          </Spin>
        </Modal>
      );
    }
  }
}

export default Form.create()(EditAndViewCardModal);
