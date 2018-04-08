import {Component} from 'react';
import {Spin,Tabs,Icon,LocaleProvider} from 'antd';
import {observer} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import Header from '../components/public/Header';
import UserList from '../components/project/UserList';
import SprintTable from '../components/project/SprintTable';
import ProjectStore from '../stores/ProjectStore';
import CreateSprintModal from '../components/project/CreateSprintModal';
import EditAndViewSprintModal from '../components/project/EditAndViewSprintModal';
import CreateCardModal from '../components/project/CreateCardModal';
import EditAndViewCardModal from '../components/project/EditAndViewCardModal';
import CreateKanbanModal from '../components/project/CreateKanbanModal';
import EditKanbanModal from '../components/project/EditKanbanModal';

import KanbanList from "../components/project/KanbanList";

import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';


@observer
class ProjectPage extends Component{
  componentDidMount(){

    this.resizeBodyContent();

    window.onresize = () => {
      this.resizeBodyContent();
    };

    ProjectStore.loadData(this.props.match.params.projectId);
  }

  resizeBodyContent=()=>{
    const bodyContainer = document.querySelector(".body-container");
    const header = document.querySelector("#header");
    bodyContainer.style.height = `${window.innerHeight - header.offsetHeight - 5}px`;
  }

  render(){
    const projectId = this.props.match.params.projectId;
    const projectInfo = ProjectStore.getProjectInfo;
    const userInfo = ProjectStore.getUserInfo;
    const naviData = {
      'nameArray': ['首页',projectInfo.projectName],
      'idArray': [' ',projectId]
    };

    return (
      <LocaleProvider locale={zh_CN}>
        <Spin spinning={ProjectStore.getProjectPageMaskLoadingStatus} size='large' className="spin-mask">
          <Header naviData={naviData}/>
          <div className="body-container" style={{padding:20,paddingTop:15,marginTop:5}}>
            <div style={{width:1326,height:535}}>
              <div style={{ width:1056,height: '100%',display: 'inline-block'}}>
                <Tabs>
                  <Tabs.TabPane tab="迭代" key="1">
                    <div style={{height:34,position:'relative'}}>
                      <span style={{
                        fontSize:17
                      }}>迭代列表:</span>
                      {userInfo.id===projectInfo.createdBy?(
                        <Icon type="plus-circle" style={{fontSize:16,marginLeft:16,cursor:'pointer'}} onClick={()=>{
                          ProjectStore.setShowCreateSprintModal(true);
                        }}/>
                      ):(
                        <Icon type="plus-circle" style={{fontSize:16,marginLeft:16,cursor:'not-allowed',color:"#00000047"}}/>
                      )}
                      <Icon type="reload"  style={{fontSize:16,marginLeft:16,cursor:'pointer'}} onClick={()=>{
                        ProjectStore.setProjectPageMaskLoadingStatus(true);
                        ProjectStore.loadData(this.props.match.params.projectId);
                      }}/>
                    </div>
                    <div>
                      <SprintTable />
                    </div>

                    <CreateSprintModal />
                    <EditAndViewSprintModal/>
                    <CreateCardModal />
                    <EditAndViewCardModal />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="看板" key="2">
                    <div style={{height:34,position:'relative'}}>
                      <span style={{
                        fontSize:17
                      }}>看板列表:</span>
                      {userInfo.id===projectInfo.createdBy?(
                        <Icon type="plus-circle" style={{fontSize:16,marginLeft:16,cursor:'pointer'}} onClick={()=>{
                          ProjectStore.setShowCreateKanbanModal(true);
                        }}/>
                      ):(
                        <Icon type="plus-circle" style={{fontSize:16,marginLeft:16,cursor:'not-allowed',color:"#00000047"}}/>
                      )}
                      <Icon type="reload"  style={{fontSize:16,marginLeft:16,cursor:'pointer'}} onClick={()=>{
                        ProjectStore.setProjectPageMaskLoadingStatus(true);
                        ProjectStore.loadData(this.props.match.params.projectId);
                      }}/>
                    </div>
                    <div>
                      <KanbanList />
                    </div>

                    <CreateKanbanModal />
                    <EditKanbanModal />
                  </Tabs.TabPane>
                </Tabs>
              </div>
              <UserList/>
            </div>
          </div>
        </Spin>
      </LocaleProvider>
    );
  }
}

export default withRouter(ProjectPage);
