import {Component} from 'react';
import {Spin,LocaleProvider} from 'antd';
import {observer} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import Header from '../components/public/Header';
import KanbanStore from '../stores/KanbanStore';

import KanbanTable from '../components/kanban/KanbanTable';
// import kanbanPageStyles from '../assets/css/projectPage.css';

import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';


@observer
class KanbanPage extends Component{
  componentDidMount(){

    this.resizeBodyContent();

    window.onresize = () => {
      this.resizeBodyContent();
    };
    KanbanStore.setKanbanPageMaskLoadingStatus(false);
    KanbanStore.loadData(this.props.match.params.kanbanId);
  }

  resizeBodyContent=()=>{
    const kanbanContent = document.querySelector("#kanban-content");
    const header = document.querySelector("#header");
    const kanbanEditPanel = document.querySelector("#kanban-edit-panel");
    const stagingArea = document.querySelector("#staging-area");

    stagingArea.style.height = `${window.innerHeight - header.offsetHeight - kanbanEditPanel.offsetHeight - 10}px`;
    kanbanContent.style.height = `${window.innerHeight - header.offsetHeight - kanbanEditPanel.offsetHeight - 5}px`;
    kanbanContent.style.width = `${window.innerWidth - stagingArea.offsetWidth}px`;

  };

  render(){
    const projectInfo = KanbanStore.getProjectInfo;
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
              <KanbanTable />
            </div>
          </div>
        </Spin>
      </LocaleProvider>
    );
  }
}

export default withRouter(KanbanPage);
