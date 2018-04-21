import {Component} from 'react'
import {Modal,Form,Spin,Input,Select,message} from 'antd';
import KanbanStore from "../../stores/KanbanStore";
import {observer} from 'mobx-react';
import CardType from './CardType';
// import Config from "../../utils/Config";

const FormItem = Form.Item;
@observer
class EditCardModal extends Component{
  // constructor(props){
  //   super(props);
  //
  // }

  handleOnChangeAssignedPerson=(value)=>{
    KanbanStore.setAssignedPersonName(value);
  };
  render(){
    const { getFieldDecorator } = this.props.form;
    const projectInfo = KanbanStore.getProjectInfo;
    const kanbanInfo = KanbanStore.getKanbanInfo;

    const allUser = KanbanStore.getAllUserUnderProject;
    const userArray = [];
    userArray.push(<Select.Option key={0} value={0}>无</Select.Option>);
    for(let user of allUser){
      userArray.push(<Select.Option key={user.id} value={user.username}>{user.username}</Select.Option>);
    }

    const targetCard = KanbanStore.getTargetCard;
    const assignedPersonName = KanbanStore.getAssignedPersonName;
    return (
      <Modal
        title="编辑任务"
        visible={KanbanStore.getShowEditCardModal}
        destroyOnClose={true}
        okText='确定'
        cancelText='取消'
        style={{top: 30}}
        onCancel={()=>{
          KanbanStore.setShowEditCardModal(false);
          KanbanStore.setCardTypeChecked('story');
          KanbanStore.setAssignedPersonName(0);
        }}
        onOk={()=>{
          this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
              KanbanStore.setEditCardMaskLoadingStatus(true);

              const card = {
                ...targetCard,
                ...values,
                cardType:KanbanStore.getCardTypeChecked,
                projectId:projectInfo.projectId
              };
              const assignedPersonName = KanbanStore.getAssignedPersonName;
              for(let user of allUser){
                if(user.username===assignedPersonName){
                  card.assignedPersonId = user.id;
                  break;
                }
              }
              KanbanStore.updateCard(card).then(response=>{
                if(response){
                  if(response.data==='success'){
                    /* 创建成功后需要刷新数据源 */
                    KanbanStore.loadData(kanbanInfo.kanbanId);
                    KanbanStore.setEditCardMaskLoadingStatus(false);
                    message.success('修改成功');
                  }else if(response.data==='failure'){
                    message.error('修改失败，请稍后再试！');
                    KanbanStore.setEditCardMaskLoadingStatus(false);
                  }
                }else{
                  KanbanStore.setEditCardMaskLoadingStatus(false);
                  message.error('网络错误，请稍后再试！');
                }
              });
              //
              // const card = {
              //   ...values,
              //   kanbanId:kanbanInfo.kanbanId,
              //   cardType:KanbanStore.getCardTypeChecked,
              //   projectId:projectInfo.projectId,
              //   cardStatus:'pretodo'
              // };
              //
              // for(let user of allUser){
              //   if(user.username===this.state.assignedPersonName){
              //     card.assignedPersonId = user.id;
              //     break;
              //   }
              // }
              //
              // KanbanStore.createCard(card).then(response=>{

              // });
            }
          });
        }}
      >
        <Spin size='large' className="spin-mask" spinning={KanbanStore.getEditCardMaskLoadingStatus}>
          <Form>
            <FormItem
              label="任务类型">
              <CardType />
            </FormItem>
            {KanbanStore.getCardTypeChecked==='other'?(
              <FormItem
                label="类型描述"
                hasFeedback>
                {getFieldDecorator('cardDescription', {
                  rules: [{ required: true, message: '请输入自定义类型名称！'}],
                  initialValue:targetCard.cardDescription
                })(
                  <Input placeholder="请输入自定义类型名称" />
                )}
              </FormItem>
            ):(null)}

            <FormItem
              label="负责人"
              hasFeedback>
              <Select
                showSearch
                optionFilterProp="children"
                value={assignedPersonName}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                onChange={this.handleOnChangeAssignedPerson}
              >
                {userArray}
              </Select>
              {/*{getFieldDecorator('assignedPersonId', {*/}
              {/*rules: [{ required: true, message: '请选择负责人！' }],*/}
              {/*initialValue:0,*/}
              {/*})(*/}
              {/**/}
              {/*)}*/}
            </FormItem>
            <FormItem
              label="任务详情"
              hasFeedback>
              {getFieldDecorator('cardContent', {
                rules: [{ required: true, message: '请输入任务详情！' }],
                initialValue:targetCard.cardContent
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

export default Form.create()(EditCardModal);
