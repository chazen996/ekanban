import {Component} from 'react';
import {Spin} from 'antd';
import {observer} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import Header from '../components/public/Header';
import UserList from '../components/project/UserList';
import ProjectStore from '../stores/ProjectStore';

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
    const naviData = {
      'nameArray': ['首页','项目'],
      'idArray': [' ',projectId]
    };

    return (
      <Spin spinning={ProjectStore.getProjectPageMaskLoadingStatus} size='large' className="spin-mask">
        <Header naviData={naviData}/>
        <div className="body-container" style={{padding:20,paddingTop:15,marginTop:5}}>
          <div style={{width:1326,height:535}}>
            <UserList/>
          </div>
        </div>
      </Spin>
    );
  }
}

export default withRouter(ProjectPage);
