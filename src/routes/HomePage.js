import {Component} from 'react';
import {Spin,Collapse,Icon,Modal,Form,Input,message} from 'antd';
import {observer} from 'mobx-react';
import Header from '../components/public/Header';
import HomeStore from '../stores/HomeStore';
import PublicAuthKit from '../utils/PublicAuthKit';
import ProjectCard from '../components/home/ProjectCard';
import homePageStyles from "../assets/css/homePage.css";

const Panel = Collapse.Panel;
const FormItem = Form.Item;

@observer
class HomePage extends Component{

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
    bodyContainer.style.height = `${window.innerHeight - header.offsetHeight}px`;
  }

  render(){
    const naviData = {
      'nameArray': ['首页'],
      'idArray': ' '
    };

    const participatingProject = [];
    const ownerProject = [];
    const userInfo = HomeStore.getUserInfo;
    const projects = PublicAuthKit.deepCopy(HomeStore.getProjects);
    for(let project of projects){
      if(project['createdBy']===userInfo['id']){
        ownerProject.push(
          <ProjectCard key={project['projectId']} projectName={project['projectName']}
                       projectDescription={project['projectDescription']} createdDate={project['createdDate']}/>
        );
      }else{
        participatingProject.push(
          <ProjectCard projectName={project['projectName']} projectDescription={project['projectDescription']}/>
        );
      }
    }
    const defaultActivePanel = [];
    if(ownerProject.length!==0){
      defaultActivePanel.push('1');
    }
    if(participatingProject.length!==0){
      defaultActivePanel.push('2');
    }
    const { getFieldDecorator } = this.props.form;
    return (
      <Spin spinning={HomeStore.getHomePageMaskLoadingStatus} size='large' className="spin-mask">
        <Header naviData={naviData}/>
        <div className="body-container" style={{padding:20}}>
          <div style={{width:1326,height:535}}>
            <div style={{height:34}}>
              <span style={{
                fontSize:17
              }}>项目列表:</span>
              <Icon type="plus-circle" style={{fontSize:16,marginLeft:16,cursor:'pointer'}} onClick={()=>{
                HomeStore.setShowCreateProjectModal(true);
              }}/>
              <Icon type="copyright" style={{fontSize:16,marginLeft:16,cursor:'pointer'}}/>
            </div>
            <div>
              <Collapse defaultActiveKey={['1']}>
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
                    <div className={homePageStyles["project-card-container"]}>
                      {ownerProject}
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
                    <div className={homePageStyles["project-card-container"]}>
                      {participatingProject}
                    </div>
                  )}
                </Panel>
              </Collapse>
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
