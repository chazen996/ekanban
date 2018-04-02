import {Component} from 'react';
import {Spin,Collapse,Icon,Modal,Form,Input,message,Table,Divider,Tag,Pagination} from 'antd';
import {observer} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import Header from '../components/public/Header';
import EditProjectModal from '../components/home/EditProjectModal';
import CreateProjectModal from '../components/home/CreateProjectModal';
import HomeStore from '../stores/HomeStore';
import PublicAuthKit from '../utils/PublicAuthKit';
import ProjectCard from '../components/home/ProjectCard';
import homePageStyles from "../assets/css/homePage.css";

const Panel = Collapse.Panel;
// const FormItem = Form.Item;
const Search = Input.Search;

@observer
class HomePage extends Component{

  constructor(props){
    super(props)
    this.state = {
      displayStatus:'card',
      ownerCurrent:1,
      participateCurrent:1
    };
  }

  componentDidMount(){

    this.resizeBodyContent();

    window.onresize = () => {
      this.resizeBodyContent();
    };

    HomeStore.loadData(PublicAuthKit.getItem('username'));
  }

  componentWillUnmount(){
    window.onresize = null;
  }

  resizeBodyContent=()=>{
    const bodyContainer = document.querySelector(".body-container");
    const header = document.querySelector("#header");
    bodyContainer.style.height = `${window.innerHeight - header.offsetHeight - 5}px`;
  }

  handleOnSearch = (event)=>{
    const projectArray = HomeStore.getProjectsBackUp;
    let resultArray = [];
    const target = PublicAuthKit.trim(event.target.value).toLowerCase();
    if (target === '') {
      resultArray = projectArray;
    } else {
      projectArray.forEach((project) => {
        if (project['projectName'].toLowerCase().indexOf(target) >= 0) {
          resultArray.push(project);
        }
      });
    }
    HomeStore.setProjects(resultArray);
  }

  handleOnDeleteProject = (projectId)=>{
    Modal.confirm({
      title: '您确定要删除此项目?',
      content: '删除项目后将无法恢复，请谨慎操作',
      okText:'确认',
      cancelText:'取消',
      onOk() {
        HomeStore.setHomePageMaskLoadingStatus(true);
        HomeStore.deleteProject(projectId,PublicAuthKit.getItem('username')).then(response=>{
          if(response){
            if(response.data==='success'){
              /* 删除成功后需要刷新数据源 */
              HomeStore.getProjectFromWebServer(PublicAuthKit.getItem('username')).then(response=>{
                HomeStore.setCreateProjectMaskLoadingStatus(false);
                if(response){
                  HomeStore.setHomePageMaskLoadingStatus(false);
                  message.success('删除成功');
                  HomeStore.setProjects(response.data);
                  HomeStore.setProjectsBackUp(response.data);
                }else{
                  message.error('网络错误，请稍后再试！');
                }
              });
            }else if(response.data==='failure'){
              message.error('删除失败，请稍后再试！');
            }
          }else{
            HomeStore.setHomePageMaskLoadingStatus(false);
            message.error('网络错误，请稍后再试！');
          }
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  handleOnCannotClick = ()=>{
    message.warning('权限不足，无法进行相关操作');
  }

  handleOnEditProject = (projectId)=>{
    HomeStore.setEditTargetProjectId(projectId);
    HomeStore.setShowEditTargetProjectModal(true);
  }

  render(){
    const naviData = {
      'nameArray': ['首页'],
      'idArray': ' '
    };

    let participatingProject = [];
    let ownerProject = [];
    const userInfo = HomeStore.getUserInfo;
    const projects = PublicAuthKit.deepCopy(HomeStore.getProjects);
    let result = null;
    if(this.state.displayStatus==='card'){

      for(let project of projects){
        const projectItem = (
          <ProjectCard key={project['projectId']} projectName={project['projectName']} operable={project['createdBy']===userInfo['id']}
                       projectId={project['projectId']}  projectDescription={project['projectDescription']} handleOnCannotClick={this.handleOnCannotClick}
                       createdDate={project['createdDate']} handleOnDeleteProject={this.handleOnDeleteProject} handleOnEditProject={this.handleOnEditProject}/>);
        if(project['createdBy']===userInfo['id']){
          ownerProject.push(
            projectItem
          );
        }else{
          participatingProject.push(
            projectItem
          );
        }
      }

      const ownerTotalNumber = ownerProject.length;
      const ownerPageSize = 5;
      const maxOwnerPage = (parseInt(ownerTotalNumber/ownerPageSize,10)+(Math.round(ownerTotalNumber%ownerPageSize)!==0?1:0));
      const ownerCurrent =  this.state.ownerCurrent>maxOwnerPage?maxOwnerPage:this.state.ownerCurrent;
      ownerProject = ownerProject.slice((ownerCurrent-1)*ownerPageSize,(ownerCurrent*ownerPageSize));

      const participateTotalNumber = participatingProject.length;
      const participatePageSize = 5;
      const maxParticipatePage = (parseInt(participateTotalNumber/participatePageSize,10)+(Math.round(participateTotalNumber%participatePageSize)!==0?1:0));
      const participateCurrent =  this.state.ownerCurrent>maxParticipatePage?maxParticipatePage:this.state.ownerCurrent;

      participatingProject = participatingProject.slice((participateCurrent-1)*participatePageSize,(participateCurrent*participatePageSize));

      result = (
        <Collapse defaultActiveKey={['1','2']}>
          <Panel header="我的项目：" key="1">
            {ownerProject.length===0?(
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 14
              }}>
                <span style={{ color: 'rgba(0,0,0,0.45)'}}>暂无内容</span>
              </div>
            ):(
              <div>
                <div className={homePageStyles["project-card-container"]}>
                  {ownerProject}
                </div>
                <div style={{
                  position:'relative',
                  height:32
                }}>
                  <Pagination style={{position:'absolute',right: 0}} current={ownerCurrent} pageSize={ownerPageSize} total={ownerTotalNumber} onChange={(page, pageSize)=>{
                    this.setState({
                      ownerCurrent:page
                    });
                  }}/>
                </div>
              </div>

            )}
          </Panel>
          <Panel header="我参与的项目：" key="2">
            {participatingProject.length===0?(
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 14
              }}>
                <span style={{ color: 'rgba(0,0,0,0.45)'}}>暂无内容</span>
              </div>
            ):(
              <div>
                <div className={homePageStyles["project-card-container"]}>
                  {participatingProject}
                </div>
                <div style={{
                  position:'relative',
                  height:32
                }}>
                  <Pagination style={{position:'absolute',right: 0}} current={participateCurrent} pageSize={participatePageSize} total={participateTotalNumber} onChange={(page, pageSize)=>{
                    this.setState({
                      participateCurrent:page
                    });
                  }}/>
                </div>
              </div>
            )}
          </Panel>
        </Collapse>
      );

    }else if(this.state.displayStatus==='table'){
      const columns = [{
        title: '项目名称',
        dataIndex: 'projectName',
        key: 'projectName',
        width:'15%',
        render: (text, record) => (
          <span>
            <a href="javascript:void(0)" onClick={()=>{
              this.props.history.push(`/project/${record.projectId}`);
            }}>{record.projectName}</a>
          </span>
        ),
        sorter: (a, b) => {
          if(a.projectName>b.projectName){
            return 1;
          }else if(a.projectName===b.projectName){
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
        title: '项目描述',
        dataIndex: 'projectDescription',
        key: 'projectDescription',
        width:'40%'
      }, {
        title: '创建时间',
        dataIndex: 'createdDate',
        key: 'createdDate',
        width:'20%',
        sorter: (a, b) => {
          if(a.createdDate>b.createdDate){
            return 1;
          }else if(a.createdDate===b.createdDate){
            return 0;
          }else{
            return -1;
          }
        }
      },{
        title: '操作',
        key: 'action',
        width:'10%',
        render: (text, record) => (
          <span>
            {record.createdBy===userInfo['id']?(
              <Icon type="delete" style={{cursor:'pointer',color:'#1890ff'}} onClick={this.handleOnDeleteProject.bind(this,record.projectId)}/>
            ):(
              <Icon type="delete" style={{cursor:'not-allowed'}} onClick={this.handleOnCannotClick}/>
            )}
            <Divider type="vertical" />
            {record.createdBy===userInfo['id']?(
              <Icon type="edit" style={{cursor:'pointer',color:'#1890ff'}} onClick={this.handleOnEditProject.bind(this,record.projectId)}/>
            ):(
              <Icon type="edit" style={{cursor:'not-allowed'}} onClick={this.handleOnCannotClick}/>
            )}
          </span>
        ),
      }];

      /* 为projects添加Key */
      for(let item of projects){
        item['key'] = item['projectId'];
      }

      result = (<Table dataSource={projects} columns={columns} locale={{emptyText:'暂无数据',}} />);
    }

    // const { getFieldDecorator } = this.props.form;
    return (
      <Spin spinning={HomeStore.getHomePageMaskLoadingStatus} size='large' className="spin-mask">
        <Header naviData={naviData}/>
        <div className="body-container" style={{padding:20,paddingTop:15,marginTop:5}}>
          <div style={{width:1326,height:535}}>
            <div style={{height:34,position:'relative'}}>
              <span style={{
                  fontSize:17
                }}>项目列表:</span>
              <Icon type="plus-circle" style={{fontSize:16,marginLeft:16,cursor:'pointer'}} onClick={()=>{
                HomeStore.setShowCreateProjectModal(true);
              }}/>
              <Icon type="swap" style={{fontSize:20,marginLeft:16,cursor:'pointer',fontWeight: 'bold',position: 'relative',top: 2}} onClick={()=>{
                if(this.state.displayStatus==='card'){
                  message.success('已切换到列表显示状态！');
                }else if(this.state.displayStatus==='table'){
                  message.success('已切换到卡片显示状态！');
                }
                this.setState({
                  displayStatus:this.state.displayStatus==='card'?'table':'card',
                });
              }}/>
              <Icon type="reload"  style={{fontSize:16,marginLeft:16,cursor:'pointer'}} onClick={()=>{
                HomeStore.setHomePageMaskLoadingStatus(true);
                HomeStore.loadData(userInfo['username']);
              }}/>
              <Search
                placeholder="输入项目名称"
                onChange={this.handleOnSearch}
                enterButton
                style={{width:350,position:'absolute',right:0,height:30 }}

              />
            </div>
            <div>
              {result}
            </div>
          </div>
        </div>

        <CreateProjectModal />

        <EditProjectModal />
      </Spin>
    );
  }


}

export default withRouter(Form.create()(HomePage));
