import {Component} from 'react';
import {Spin,LocaleProvider} from 'antd';
import {observer} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import Header from '../components/public/Header';
import KanbanStore from '../stores/KanbanStore';
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

    KanbanStore.loadData(this.props.match.params.kanbanId);
  }

  resizeBodyContent=()=>{
    const bodyContainer = document.querySelector(".body-container");
    const header = document.querySelector("#header");
    bodyContainer.style.height = `${window.innerHeight - header.offsetHeight - 5}px`;
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
          <div className="body-container" style={{padding:20,paddingTop:15,marginTop:5}}>
            <div>
              看板页面
            </div>
          </div>
        </Spin>
      </LocaleProvider>
    );
  }
}

export default withRouter(KanbanPage);
