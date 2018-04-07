import {Component} from 'react'
import {Modal,Form,Spin,Input,message,DatePicker } from 'antd';
import ProjectStore from "../../stores/ProjectStore";
import {observer} from 'mobx-react';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
@observer
class CreateSprintModal extends Component{
  render(){
    const { getFieldDecorator } = this.props.form;
    // const userInfo = ProjectStore.getUserInfo;
    const projectInfo = ProjectStore.getProjectInfo;
    return (
      <Modal
        title="新建迭代"
        visible={ProjectStore.getShowCreateSprintModal}
        destroyOnClose={true}
        okText='确定'
        cancelText='取消'
        onCancel={()=>{
          ProjectStore.setShowCreateSprintModal(false);
        }}
        onOk={()=>{
          this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
              ProjectStore.setCreateSprintMaskLoadingStatus(true);
              const rangeTimeValue = [
                values.startAndEndDate[0].format('YYYY-MM-DD HH:mm:ss'),
                values.startAndEndDate[1].format('YYYY-MM-DD HH:mm:ss'),
              ];

              const sprint = {};
              sprint['sprintName'] = this.props.form.getFieldValue('sprintName');
              sprint['sprintDescription'] = this.props.form.getFieldValue('sprintDescription');
              sprint['startDate'] = rangeTimeValue[0];
              sprint['endDate'] = rangeTimeValue[1];
              sprint['projectId'] = projectInfo.projectId;
              ProjectStore.createSprint(sprint).then(response=>{
                if(response){
                  if(response.data==='success'){
                    /* 创建成功后需要刷新数据源 */
                    ProjectStore.getSprintsFromWebServer(projectInfo.projectId).then(response=>{
                      ProjectStore.setCreateSprintMaskLoadingStatus(false);
                      if(response){
                        ProjectStore.setShowCreateSprintModal(false);
                        message.success('创建成功');
                        ProjectStore.setSprints(response.data);
                        // HomeStore.setProjectsBackUp(response.data);
                      }else{
                        message.error('网络错误，请稍后再试！');
                      }
                    });
                  }else if(response.data==='failure'){
                    message.error('创建失败，请稍后再试！');
                    ProjectStore.setCreateSprintMaskLoadingStatus(false);
                  }
                }else{
                  ProjectStore.setCreateSprintMaskLoadingStatus(false);
                  message.error('网络错误，请稍后再试！');
                }
              });
            }
          });
        }}
      >
        <Spin size='large' className="spin-mask" spinning={ProjectStore.getCreateSprintMaskLoadingStatus}>
          <Form>
            <FormItem
              label="迭代名称"
              hasFeedback>
              {getFieldDecorator('sprintName', {
                rules: [{ required: true, message: '请输入迭代名称！' }],
              })(
                <Input placeholder="请输入迭代名称" />
              )}
            </FormItem>
            <FormItem
              label="起止时间"
              hasFeedback>
              {getFieldDecorator('startAndEndDate', {
                rules: [{ type: 'array', required: true, message: '请选择起止时间！'}],
              })(
                <RangePicker onChange={(date, dateString)=>{
                  console.log(date, dateString);
                }} />
              )}
            </FormItem>
            <FormItem
              label="迭代描述"
              hasFeedback>
              {getFieldDecorator('sprintDescription', {
                rules: [{ required: true, message: '请输入迭代描述！' }],
              })(
                <Input.TextArea placeholder="请输入迭代描述" autosize={false} rows={4}/>
              )}
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    );
  }
}

export default Form.create()(CreateSprintModal);
