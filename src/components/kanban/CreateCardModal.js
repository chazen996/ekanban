import {Component} from 'react'
import {Modal,Form,Spin,Input,message,Select} from 'antd';
import KanbanStore from "../../stores/KanbanStore";
import {observer} from 'mobx-react';
import CardType from './CardType';
// import Config from "../../utils/Config";

const FormItem = Form.Item;
@observer
class CreateCardModal extends Component{
  constructor(props){
    super(props);

    this.state={
      assignedPersonName:0
    };
  }

  handleOnChangeAssignedPerson=(value)=>{
    this.setState({
      assignedPersonName:value
    });
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
    return (
      <Modal
        title="新建任务"
        visible={KanbanStore.getShowCreateCardModal}
        destroyOnClose={true}
        okText='确定'
        cancelText='取消'
        style={{top:20}}
        onCancel={()=>{
          KanbanStore.setShowCreateCardModal(false);
        }}
        onOk={()=>{
          this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
              KanbanStore.setCreateCardMaskLoadingStatus(true);

              const card = {
                ...values,
                kanbanId:kanbanInfo.kanbanId,
                cardType:KanbanStore.getCardTypeChecked,
                projectId:projectInfo.projectId,
                cardStatus:'pretodo'
              };

              for(let user of allUser){
                if(user.username===this.state.assignedPersonName){
                  card.assignedPersonId = user.id;
                  break;
                }
              }

              KanbanStore.createCard(card).then(response=>{
                if(response){
                  if(response.data==='success'){
                    /* 创建成功后需要刷新数据源 */
                    message.success('创建成功');
                    KanbanStore.loadData(kanbanInfo.kanbanId);
                    KanbanStore.setShowCreateCardModal(false);
                    KanbanStore.setCreateCardMaskLoadingStatus(false);
                  }else if(response.data==='failure'){
                    message.error('创建失败，请稍后再试！');
                    KanbanStore.setCreateCardMaskLoadingStatus(false);
                  }
                }else{
                  KanbanStore.setCreateCardMaskLoadingStatus(false);
                  message.error('网络错误，请稍后再试！');
                }
              });
            }
          });
        }}
      >
        <Spin size='large' className="spin-mask" spinning={KanbanStore.getCreateCardMaskLoadingStatus}>
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
                value={this.state.assignedPersonName}
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
