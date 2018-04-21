import React from 'react';
import { Icon,Dropdown,Menu,message } from 'antd';
import ProjectStore from "../../stores/ProjectStore";
import {observer} from 'mobx-react';
import {withRouter} from 'react-router-dom';

const kanban = require('../../assets/images/kanban.png');

@observer
class Kanban extends React.Component {

  handleOnDeleteKanban=(kanban,event)=>{
    event.stopPropagation();
    const kanbanTemp = {};
    const projectInfo = ProjectStore.getProjectInfo;
    kanbanTemp.kanbanId = kanban.kanbanId;
    kanbanTemp.projectId = kanban.projectId;
    ProjectStore.deleteKanban(kanbanTemp).then(response=>{
      if(response){
        if(response.data==='success'){
          ProjectStore.getKanbansFromWebServer(projectInfo.projectId).then(response=>{
            if(response){
              message.success('删除看板成功！');
              ProjectStore.setKanbans(response.data);
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

  handleOnEditKanban=(kanban,event)=>{
    event.stopPropagation();
    ProjectStore.setTargetKanban(kanban);
    ProjectStore.setShowEditKanbanModal(true);
  };


  render() {
    const userInfo = ProjectStore.getUserInfo;
    const projectInfo = ProjectStore.getProjectInfo;
    return (
      <div style={{
        width:200,
        height:211,
        border:'1px solid #3333',
        boxShadow: '0 1px 6px rgba(0,0,0,.2)',
        margin:'14px 20px',
        cursor:'pointer'
      }} onClick={()=>{
        this.props.history.push(`/kanban/${this.props.kanban.kanbanId}`);
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 175,
          padding: 25,
          position:'relative'
        }}>
          <img src={kanban} alt="kanban" style={{
            width:'100%'
          }}/>
          <div id='dropdown-container' style={{
            position: 'relative',
            zIndex: 2
          }}>

          </div>
          <Dropdown disabled={projectInfo.createdBy!==userInfo.id} overlay={
            (
              <Menu>
                <Menu.Item>
                  <a href="javascript:void(0)" onClick={this.handleOnEditKanban.bind(this,this.props.kanban)}>编辑</a>
                </Menu.Item>
                <Menu.Item>
                  <a href="javascript:void(0)" onClick={this.handleOnDeleteKanban.bind(this,this.props.kanban)}>删除</a>
                </Menu.Item>
              </Menu>
            )
          }
            getPopupContainer={()=>document.getElementById('dropdown-container')}
          >
            <Icon type="ellipsis" style={{
              position: 'absolute',
              top: 0,
              right: 9,
              fontSize: 24,
              cursor:projectInfo.createdBy!==userInfo.id?('not-allowed'):('pointer')
            }}/>
          </Dropdown>
        </div>
        <div>
          <span style={{
            marginLeft: 12,
            fontWeight: 'bold',
            color:'rgba(0, 0, 0, 0.68)'
          }}>{this.props.kanban.kanbanName}</span>
        </div>
      </div>
    );
  }
}

export default withRouter(Kanban);
