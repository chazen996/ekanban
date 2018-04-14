import {Component} from 'react';
import {Spin,LocaleProvider} from 'antd';
import {observer} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import Header from '../components/public/Header';
import KanbanStore from '../stores/KanbanStore';
import EditKanbanTable from '../components/kanban/EditKanbanTable';
// import kanbanPageStyles from '../assets/css/projectPage.css';

import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';


@observer
class EditKanbanPage extends Component{
  componentDidMount(){

    this.resizeBodyContent();

    window.onresize = () => {
      this.resizeBodyContent();
    };

    KanbanStore.loadData(this.props.match.params.kanbanId,true);
  }

  resizeBodyContent=()=>{
    const kanbanContent = document.querySelector("#kanban-content");
    const header = document.querySelector("#header");
    const kanbanEditPanel = document.querySelector("#kanban-edit-panel");

    kanbanContent.style.height = `${window.innerHeight - header.offsetHeight - kanbanEditPanel.offsetHeight - 5}px`;
  };

  render(){
    // const kanbanId = this.props.match.params.kanbanId;
    const projectInfo = KanbanStore.getProjectInfo;
    // const userInfo = KanbanStore.getUserInfo;
    const kanbanInfo = KanbanStore.getKanbanInfo;
    const naviData = {
      'nameArray': ['首页',projectInfo.projectName,kanbanInfo.kanbanName],
      'idArray': [' ',projectInfo.projectId,kanbanInfo.kanbanId]
    };

    return (
      <LocaleProvider locale={zh_CN}>
        <Spin spinning={KanbanStore.getKanbanPageMaskLoadingStatus} size='large' className="spin-mask">
          <Header naviData={naviData}/>
          <div style={{marginTop:5}}>
            <div>
              <EditKanbanTable />
            </div>
          </div>
        </Spin>
      </LocaleProvider>
    );
  }
}

export default withRouter(EditKanbanPage);
