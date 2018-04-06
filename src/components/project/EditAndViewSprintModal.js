import {Component} from 'react'
import {Modal,Form,Spin,Input,message,DatePicker } from 'antd';
import ProjectStore from "../../stores/ProjectStore";
import {observer} from 'mobx-react';
import moment from 'moment';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
@observer
class EditAndViewSprintModal extends Component{
  render(){
    const { getFieldDecorator } = this.props.form;
    const projectInfo = ProjectStore.getProjectInfo;
    const targetSprintId = ProjectStore.getTargetSprintId;
    const sprints = ProjectStore.getSprints;
    let targetSprint = {};
    for(let item of sprints){
      if(item.sprintId===targetSprintId){
        targetSprint = item;
        break;
      }
    }

    const useForEditOrView = ProjectStore.getEditOrView;
    const dateFormat = 'YYYY-MM-DD';
    if(useForEditOrView==='edit'){
      return (
        <Modal
          title="编辑迭代"
          visible={ProjectStore.getShowEditOrViewSprintModal}
          destroyOnClose={true}
          okText='确定'
          cancelText='取消'
          onCancel={()=>{
            ProjectStore.setShowEditOrViewSprintModal(false);
          }}
          onOk={()=>{
            this.props.form.validateFieldsAndScroll((err, values) => {
              if(!err){
                ProjectStore.setEditOrViewPrintMaskLoadingStatus(true);
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
                sprint['sprintId'] = targetSprint.sprintId;
                ProjectStore.updateSprint(sprint).then(response=>{
                  if(response){
                    if(response.data==='success'){
                      /* 创建成功后需要刷新数据源 */
                      ProjectStore.getSprintsFromWebServer(projectInfo.projectId).then(response=>{
                        ProjectStore.setEditOrViewPrintMaskLoadingStatus(false);
                        if(response){
                          ProjectStore.setShowEditOrViewSprintModal(false);
                          message.success('修改成功！');
                          ProjectStore.setSprints(response.data);
                          // HomeStore.setProjectsBackUp(response.data);
                        }else{
                          message.error('网络错误，请稍后再试！');
                        }
                      });
                    }else if(response.data==='failure'){
                      message.error('修改失败，请稍后再试！');
                      ProjectStore.setEditOrViewPrintMaskLoadingStatus(false);
                    }
                  }else{
                    ProjectStore.setEditOrViewPrintMaskLoadingStatus(false);
                    message.error('网络错误，请稍后再试！');
                  }
                });
              }
            });
          }}
        >
          <Spin size='large' className="spin-mask" spinning={ProjectStore.getEditOrViewPrintMaskLoadingStatus}>
            <Form>
              <FormItem
                label="迭代名称"
                hasFeedback>
                {getFieldDecorator('sprintName', {
                  rules: [{ required: true, message: '请输入迭代名称！' }],
                  initialValue: targetSprint.sprintName
                })(
                  <Input placeholder="请输入迭代名称" />
                )}
              </FormItem>
              <FormItem
                label="起止时间"
                hasFeedback>
                {getFieldDecorator('startAndEndDate', {
                  rules: [{ type: 'array', required: true, message: '请选择起止时间！'}],
                  initialValue: [moment(targetSprint.startDate, dateFormat), moment(targetSprint.endDate, dateFormat)],
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
                  initialValue: targetSprint.sprintDescription,
                })(
                  <Input.TextArea placeholder="请输入迭代描述" autosize={false} rows={4}/>
                )}
              </FormItem>
            </Form>
          </Spin>
        </Modal>
      );
    }else if(useForEditOrView==='view'){
      return (
        <Modal
          title="迭代详情"
          visible={ProjectStore.getShowEditOrViewSprintModal}
          destroyOnClose={true}
          okText='确定'
          cancelText='取消'
          onCancel={()=>{
            ProjectStore.setShowEditOrViewSprintModal(false);
          }}
          footer={null}
        >
          <Spin size='large' className="spin-mask" spinning={ProjectStore.getEditOrViewPrintMaskLoadingStatus}>
            <Form>
              <FormItem
                label="迭代名称">
                {getFieldDecorator('sprintName', {
                  rules: [{ required: true, message: '请输入迭代名称！' }],
                  initialValue: targetSprint.sprintName
                })(
                  <Input placeholder="请输入迭代名称" disabled />
                )}
              </FormItem>
              <FormItem
                label="起止时间">
                {getFieldDecorator('startAndEndDate', {
                  rules: [{ type: 'array', required: true, message: '请选择起止时间！'}],
                  initialValue: [moment(targetSprint.startDate, dateFormat), moment(targetSprint.endDate, dateFormat)],
                })(
                  <RangePicker disabled onChange={(date, dateString)=>{
                    console.log(date, dateString);
                  }} />
                )}
              </FormItem>
              <FormItem
                label="迭代描述">
                {getFieldDecorator('sprintDescription', {
                  rules: [{ required: true, message: '请输入迭代描述！' }],
                  initialValue: targetSprint.sprintDescription,
                })(
                  <Input.TextArea disabled placeholder="请输入迭代描述" autosize={false} rows={4}/>
                )}
              </FormItem>
            </Form>
          </Spin>
        </Modal>
      );
    }
  }
}

export default Form.create()(EditAndViewSprintModal);
