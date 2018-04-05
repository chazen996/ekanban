import {Component} from 'react';
import {Table,Icon,Tag,Divider,Switch} from 'antd';
import {observer} from 'mobx-react';
import ProjectStore from "../../stores/ProjectStore";
import PublicAuthKit from "../../utils/PublicAuthKit";

@observer
class SprintTable extends Component{

  render(){
    const userInfo = ProjectStore.getUserInfo;
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
          }} title={record.sprintName}>{record.sprintName}</a>
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
    }, {
      title:'用户角色',
      key:'userRole',
      width:'15%',
      render:(text,record)=>{
        if(record["createdBy"]===userInfo['id']){
          return (<Tag color="#f50">创建者</Tag>);
        }else{
          return (<Tag color="#2db7f5">参与者</Tag>);
        }
      }
    }, {
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
            color: 'rgba(0,0,0,0.45)',
            border: '1px solid'
          }}>
            关闭
          </span>)
        }else if(record.sprintStatus==='open'){
          return (<span style={{
            color: 'rgba(0,0,0,0.45)',
            border: '1px solid'
          }}>开启</span>)
        }
      }
    }, {
      title: '状态操作',
      key: 'statusAction',
      width:'20%',
      render:(text,record)=>{
        return (<Switch checkedChildren="开启" unCheckedChildren="关闭" size="small" defaultChecked={record.sprintStatus!=='closed'} />)
      }
    },{
      title: '其他操作',
      key: 'action',
      width:'10%',
      render: (text, record) => (
        <span>
            {record.createdBy===userInfo['id']?(
              <Icon type="delete" style={{cursor:'pointer',color:'#1890ff'}}/>
            ):(
              <Icon type="delete" style={{cursor:'not-allowed'}} onClick={this.handleOnCannotClick}/>
            )}
          <Divider type="vertical" />
          {record.createdBy===userInfo['id']?(
            <Icon type="edit" style={{cursor:'pointer',color:'#1890ff'}}/>
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
              <Tag color="#f50">{record.cardDescription}</Tag>
            ):(
              <Tag color="#f50">{record.cardType}</Tag>
            )}
          </span>
        )
      }, {
        title:'任务详情',
        dataIndex: 'cardContent',
        key: 'cardContent',
        width:'15%'
      },{
        title: '认领人',
        key: 'assignedPerson',
        width:'10%',
        render: (text, record) => (
          <span style={{
            color: 'rgba(0,0,0,0.45)',
            border: '1px solid'
          }}>暂无</span>
        ),
      },{
        title: '看板',
        key: 'kanban',
        width:'10%',
        render: (text, record) => (
          <span style={{
            color: 'rgba(0,0,0,0.45)',
            border: '1px solid'
          }}>暂无</span>
        ),
      },{
        title: '操作',
        key: 'action',
        width:'10%',
        render: (text, record) => (
          <span>
            {record.createdBy===userInfo['id']?(
              <Icon type="delete" style={{cursor:'pointer',color:'#1890ff'}}/>
            ):(
              <Icon type="delete" style={{cursor:'not-allowed'}} onClick={this.handleOnCannotClick}/>
            )}
            <Divider type="vertical" />
            {record.createdBy===userInfo['id']?(
              <Icon type="edit" style={{cursor:'pointer',color:'#1890ff'}}/>
            ):(
              <Icon type="edit" style={{cursor:'not-allowed'}}/>
            )}
          </span>
        ),
      }];
      for(let item of record.cardList){
        item.key = item.cardId;
      }
      return (
        <Table dataSource={record.cardList} columns={cardColumn}/>
      );
    };

    return (
      <Table dataSource={sprints} columns={columns} expandedRowRender={expandedRowRender}/>
    );
  }
}

export default SprintTable;
