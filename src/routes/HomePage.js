import {Component} from 'react';
import {Spin,Collapse,Icon,Modal,Form,Input,message,Table,Divider,Tag,Pagination} from 'antd';
import {observer} from 'mobx-react';
import Header from '../components/public/Header';
import HomeStore from '../stores/HomeStore';
import PublicAuthKit from '../utils/PublicAuthKit';
import ProjectCard from '../components/home/ProjectCard';
import homePageStyles from "../assets/css/homePage.css";

const Panel = Collapse.Panel;
const FormItem = Form.Item;
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

    HomeStore.loadUserInfoFromWebServer(PublicAuthKit.getItem('username'));
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
                       projectId={project['projectId']}  projectDescription={project['projectDescription']} createdDate={project['createdDate']}/>);
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
                justifyContent: 'center'
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
                justifyContent: 'center'
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
        width:'15%'
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
        width:'20%'
      },{
        title: '操作',
        key: 'action',
        width:'10%',
        render: (text, record) => (
          <span>
            <Icon type="delete" />
            <Divider type="vertical" />
            <Icon type="edit" />
          </span>
        ),
      }];

      /* 为projects添加Key */
      for(let item of projects){
        item['key'] = item['projectId'];
      }

      result = (<Table dataSource={projects} columns={columns} locale={{emptyText:'暂无数据',}} />);
    }


    const { getFieldDecorator } = this.props.form;
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
              <Icon type="bars" style={{fontSize:20,marginLeft:16,cursor:'pointer',fontWeight: 'bold',position: 'relative',top: 2}} onClick={()=>{
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
                HomeStore.loadUserInfoFromWebServer(userInfo['username']);
              }}/>
              <Search
                placeholder="输入项目名称"
                onChange={this.handleOnSearch}
                enterButton
                style={{width:350,position:'absolute',right:0}}
              />
            </div>
            <div>
              {result}
            </div>
          </div>
        </div>

        <Modal
          title="新建项目"
          visible={HomeStore.getShowCreateProjectModal}
          destroyOnClose={true}
          okText='确定'
          cancelText='取消'
          onCancel={()=>{
            HomeStore.setShowCreateProjectModal(false);
          }}
          onOk={()=>{
            this.props.form.validateFieldsAndScroll((err, values) => {
              if(!err){
                HomeStore.setCreateProjectMaskLoadingStatus(true);

                let username = userInfo['username'];
                const project = {};
                project['projectName'] = this.props.form.getFieldValue('projectName');
                project['projectDescription'] = this.props.form.getFieldValue('projectDescription');
                project['createdBy'] = userInfo['id'];
                HomeStore.createProject(project,username).then(response=>{
                  if(response){
                    if(response.data==='success'){
                      /* 创建成功后需要刷新数据源 */
                      HomeStore.getProjectFromWebServer(userInfo.username).then(response=>{
                        HomeStore.setCreateProjectMaskLoadingStatus(false);
                        if(response){
                          HomeStore.setShowCreateProjectModal(false);
                          message.success('创建成功');
                          HomeStore.setProjects(response.data);
                          HomeStore.setProjectsBackUp(response.data);
                        }else{
                          message.error('网络错误，请稍后再试！');
                        }
                      });
                    }else if(response.data==='failure'){
                      message.error('创建失败，请稍后再试！');
                    }
                  }else{
                    HomeStore.setCreateProjectMaskLoadingStatus(false);
                    message.error('网络错误，请稍后再试！');
                  }
                });
              }
            });
          }}
        >
          <Spin size='large' className="spin-mask" spinning={HomeStore.getCreateProjectMaskLoadingStatus}>
            <Form>
              <FormItem
                label="项目名称"
                hasFeedback>
                {getFieldDecorator('projectName', {
                  rules: [{ required: true, message: '请输入项目名称！' }],
                })(
                  <Input placeholder="请输入项目名称" />
                )}
              </FormItem>
              <FormItem
                label="项目描述"
                hasFeedback>
                {getFieldDecorator('projectDescription', {
                  rules: [{ required: true, message: '请输入项目描述！' }],
                })(
                  <Input.TextArea placeholder="请输入项目描述" autosize={false} rows={4}/>
                )}
              </FormItem>
            </Form>
          </Spin>
        </Modal>
      </Spin>
    );
  }


}

export default Form.create()(HomePage);
