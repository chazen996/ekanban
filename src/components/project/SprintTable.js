import {Component} from 'react';
import {Table,Icon,Tag,Divider,Switch,Button,message} from 'antd';
import {observer} from 'mobx-react';
import ProjectStore from "../../stores/ProjectStore";
import PublicAuthKit from "../../utils/PublicAuthKit";
import Config from "../../utils/Config";

@observer
class SprintTable extends Component{

  handleOnEditSprint=(sprintId)=>{
    ProjectStore.setEditOrView('edit');
    ProjectStore.setTargetSprintId(sprintId);
    ProjectStore.setShowEditOrViewSprintModal(true);
  };
  handleOnViewSprint=(sprintId)=>{
    ProjectStore.setEditOrView('view');
    ProjectStore.setTargetSprintId(sprintId);
    ProjectStore.setShowEditOrViewSprintModal(true);
  };
  handleOnCreateCard=(sprintId)=>{
    ProjectStore.setTargetSprintId(sprintId);
    ProjectStore.setShowCreateCardModal(true);
  };
  handleOnOpenOrCloseSprint=(sprintId,sprintStatus)=>{
    const projectInfo = ProjectStore.getProjectInfo;
    const sprint={};
    sprint.sprintId = sprintId;
    sprint.sprintStatus = sprintStatus==='closed'?'open':'closed';
    sprint.projectId = projectInfo.projectId;
    ProjectStore.openOrCloseSprint(sprint).then(response=>{
      if(response){
        if(response.data==='success'){
          ProjectStore.getSprintsFromWebServer(projectInfo.projectId).then(response=>{
            if(response){
              if(sprintStatus==='open'){
                message.success('关闭迭代成功！');
              }else if(sprintStatus==='closed'){
                message.success('开启迭代成功！');
              }
              ProjectStore.setSprints(response.data);
            }else{
              message.error('网络错误，请稍后再试！');
            }
          });
        }else if(response.data==='failure'){
          if(sprintStatus==='open'){
            message.error('关闭迭代失败！');
          }else if(sprintStatus==='closed'){
            message.error('开启迭代失败！');
          }
        }
      }else{
        message.error('网络错误，请稍后再试！');
      }
    });
  };

  handleOnDeleteSprint=(sprintId)=>{
    const sprint = {};
    const projectInfo = ProjectStore.getProjectInfo;
    sprint.projectId = projectInfo.projectId;
    sprint.sprintId = sprintId;
    ProjectStore.deleteSprint(sprint).then(response=>{
      if(response){
        if(response.data==='success'){
          ProjectStore.getSprintsFromWebServer(projectInfo.projectId).then(response=>{
            if(response){
              message.success('删除迭代成功！');
              ProjectStore.setSprints(response.data);
            }else{
              message.error('网络错误，请稍后再试！');
            }
          });
        }else if(response.data==='failure'){
          message.error('删除失败，请稍后再试！');
        }
      }else{
        message.error('网络错误，请稍后再试！');
      }
    });
  };

  handleOnDeleteCard=(cardId)=>{
    const card = {};
    const projectInfo = ProjectStore.getProjectInfo;
    card.cardId=cardId;
    card.projectId=projectInfo.projectId;
    ProjectStore.deleteCard(card).then(response=>{
      if(response){
        if(response.data==='success'){
          ProjectStore.getSprintsFromWebServer(projectInfo.projectId).then(response=>{
            if(response){
              message.success('删除成功！');
              ProjectStore.setSprints(response.data);
            }else{
              message.error('网络错误，请稍后再试！');
            }
          });
        }else if(response.data==='failure'){
          message.error('删除失败，请稍后再试！');
        }
      }else{
        message.error('网络错误，请稍后再试！');
      }
    });
  };

  handleOnViewCard=(targetCard)=>{
    ProjectStore.setEditOrView('view');
    ProjectStore.setTargetCard(targetCard);
    ProjectStore.setShowEditOrViewCardModal(true);
  };

  handleOnEditCard=(targetCard)=>{
    ProjectStore.setEditOrView('edit');
    ProjectStore.setCardTypeChecked(targetCard.cardType);
    ProjectStore.setTargetCard(targetCard);

    const assignedPerson = targetCard.assignedPerson;
    ProjectStore.setAssignedPersonId(assignedPerson==null?0:assignedPerson.id);

    ProjectStore.setShowEditOrViewCardModal(true);
  };
  render(){
    const userInfo = ProjectStore.getUserInfo;
    const projectInfo = ProjectStore.getProjectInfo;
    const sprints = PublicAuthKit.deepCopy(ProjectStore.getSprints);
    const columns = [{
      title: '迭代名称',
      dataIndex: 'sprintName',
      key: 'sprintName',
      width:'15%',
      render: (text, record) => (
        <span>
          <a href="javascript:void(0)" style={{
            maxWidth: 90,
            display: 'inline-block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }} title={record.sprintName} onClick={this.handleOnViewSprint.bind(this,record.sprintId)}>{record.sprintName}</a>
        </span>
      ),
      sorter: (a, b) => {
        if(a.sprintName>b.sprintName){
          return 1;
        }else if(a.sprintName===b.sprintName){
          return 0;
        }else{
          return -1;
        }
      }
    },{
      title: '迭代描述',
      key: 'sprintDescription',
      width:'40%',
      render:(text,record)=>{
        return (<div style={{
          maxWidth: 300,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'}} title={record.sprintDescription}>
          {record.sprintDescription}
        </div>);
      }
    }, {
      title: '状态',
      key: 'sprintStatus',
      width:'20%',
      render:(text,record)=>{
        if(record.sprintStatus==='closed'){
          return (<span style={{
            color: Config.sprintStatusColor[record.sprintStatus],
          }}>
            已关闭
          </span>)
        }else if(record.sprintStatus==='open'){
          return (<span style={{
            color: Config.sprintStatusColor[record.sprintStatus],
          }}>已开启</span>)
        }
      }
    }, {
      title: '状态操作',
      key: 'statusAction',
      width:'20%',
      render:(text,record)=>{
        return (<Switch disabled={projectInfo.createdBy!==userInfo.id} style={{cursor:projectInfo.createdBy!==userInfo.id?'not-allowed':''}} checkedChildren="开启" unCheckedChildren="关闭" size="small" checked={record.sprintStatus!=='closed'} onChange={this.handleOnOpenOrCloseSprint.bind(this,record.sprintId,record.sprintStatus)}/>)
      }
    },{
      title: '其他操作',
      key: 'action',
      width:'10%',
      render: (text, record) => (
        <span>
            {projectInfo.createdBy===userInfo['id']?(
              <Icon type="delete" style={{cursor:'pointer',color:'#1890ff'}} onClick={this.handleOnDeleteSprint.bind(this,record.sprintId)} />
            ):(
              <Icon type="delete" style={{cursor:'not-allowed'}}/>
            )}
          <Divider type="vertical" />
          {projectInfo.createdBy===userInfo['id']?(
            <Icon type="edit" style={{cursor:'pointer',color:'#1890ff'}}  onClick={this.handleOnEditSprint.bind(this,record.sprintId)}/>
          ):(
            <Icon type="edit" style={{cursor:'not-allowed'}}/>
          )}
          </span>
      ),
    }];

    /* 为sprints添加Key */
    for(let item of sprints){
      item['key'] = item['sprintId'];
    }

    const expandedRowRender=(record)=>{
      const cardColumn = [{
        title: '任务类型',
        dataIndex: 'cardType',
        key: 'cardType',
        width:'15%',
        render: (text, record) => (
          <span>
            {record.cardType==='other'?(
              <Tag style={{maxWidth:107,overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}
                   color={Config.cardTypeColor.other} title={record.cardDescription}>{record.cardDescription}</Tag>
            ):(
              <Tag style={{maxWidth:107,overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}
                   color={Config.cardTypeColor[record.cardType]} title={record.cardDescription}>{record.cardType}</Tag>
            )}
          </span>
        )
      }, {
        title: '任务详情',
        dataIndex: 'cardContent',
        key: 'cardContent',
        width: '15%',
        render: (text, record) => (
          <a href="javascript:void(0)" style={{
            maxWidth: 150,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'inline-block'
          }} title={record.cardContent} onClick={this.handleOnViewCard.bind(this,record)}>{record.cardContent}</a>
        )
      },{
        title: '认领人',
        key: 'assignedPerson',
        width:'10%',
        render: (text, record) => {
          if(record.assignedPerson==null){
            return <span style={{
              color: 'rgba(0,0,0,0.45)',
            }}>暂无</span>
          }else{
            return <span style={{color:'#faad14'}}>{record.assignedPerson.username}</span>
          }
        }
      },{
        title: '看板',
        key: 'kanban',
        width:'10%',
        render: (text, record) => {
          if(record.kanban==null){
            return <span style={{
              color: 'rgba(0,0,0,0.45)',
            }}>暂无</span>
          }else{
            return <span style={{color:'#14cefa'}}>{record.kanban.kanbanName}</span>
          }
        }
      },{
        title: '状态',
        key: 'cardStatus',
        width:'10%',
        render: (text, record) => (
          <Tag color={Config.cardStatusColor[record.cardStatus]}>
            {record.cardStatus.split(':')[0]}
          </Tag>
        ),
      },{
        title: '操作',
        key: 'action',
        width:'10%',
        render: (text, record) => (
          <span>
            <Icon type="delete" style={{cursor:'pointer',color:'#1890ff'}} onClick={this.handleOnDeleteCard.bind(this,record.cardId)}/>
            <Divider type="vertical" />
            <Icon type="edit" style={{cursor:'pointer',color:'#1890ff'}} onClick={this.handleOnEditCard.bind(this,record)}/>
          </span>
        ),
      }];
      for(let item of record.cardList){
        item.key = item.cardId;
      }
      let result = null;
      if(record.cardList.length===0){
        result = (<div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}>暂无内容</div>);
      }else{
        result = (
          <Table dataSource={record.cardList} columns={cardColumn}/>
        );
      }
      return (
        <div>
          <div style={{height:34}}>
            <Button type='primary' size='small' onClick={this.handleOnCreateCard.bind(this,record.sprintId)}>新建任务</Button>
          </div>
          {result}
        </div>
      );
    };

    return (
      sprints==null||sprints.length===0?(
        <div style={{
          height: 50,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderBottom: '1px solid #e8e8e8',
          borderTop: '1px solid #e8e8e8'
          // background: '#f5f5f5'
        }}>
            <span style={{
              color:'rgba(0,0,0,0.45)'
            }}>暂无内容</span>
        </div>
      ):(
        <Table dataSource={sprints} columns={columns} expandedRowRender={expandedRowRender}/>
      )
    );
  }
}

export default SprintTable;
