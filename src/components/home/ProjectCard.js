import {Component} from 'react';
import {Card,Icon,Dropdown,Menu,message} from 'antd';
import homePageStyles from '../../assets/css/homePage.css';
import HomeStore from '../../stores/HomeStore';
import PublicAuthKit from '../../utils/PublicAuthKit';

class ProjectCard extends Component{

  handleOnDelete=(projectId)=>{
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
  };
  render(){
    const createdDateStr = this.props.createdDate;
    const createdDate = new Date(Date.parse(createdDateStr));
    const projectId = this.props.projectId;
    return (
      <div className={homePageStyles["project-card"]}>
        <Card title={this.props.projectName} bordered={true}
              extra={
                <Dropdown overlay={(
                  <Menu>
                    <Menu.Item>
                      {!this.props.operable?(
                        <a href="javascript:void(0)" style={{background: '#80808014',color: 'rgba(0,0,0,0.25)',cursor:'not-allowed'}}>编辑</a>
                      ):(
                        <a href="javascript:void(0)" onClick={()=>{

                        }}>编辑</a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {!this.props.operable?(
                        <a href="javascript:void(0)" style={{background: '#80808014',color: 'rgba(0,0,0,0.25)',cursor:'not-allowed'}}>删除</a>
                      ):(
                        <a href="javascript:void(0)" onClick={this.handleOnDelete.bind(this,projectId)}>删除</a>
                      )}

                    </Menu.Item>
                  </Menu>
                )} getPopupContainer={()=>document.getElementById(`${this.props.projectId}-popupContainer`)}>
                  <Icon type="ellipsis" style={{ fontSize: 18,cursor:'pointer'}}/>
                </Dropdown>
              }>
          <div style={{height:75}}>
            <div style={{height:42,textOverflow:'ellipsis', display: '-webkit-box',
              WbkitBoxOrient: 'vertical',
              WebkitLineClamp: '2',
              overflow: 'hidden'}}>{this.props.projectDescription}</div>
            <div style={{
              position: 'absolute',
              bottom: 20,
              right: 24
            }}><span style={{fontSize:12,color:'rgba(0,0,0,0.45)'}}>{`${createdDate.getFullYear()}年${createdDate.getMonth()+1}月${createdDate.getDate()}日`}</span></div>
          </div>
          <div id={`${this.props.projectId}-popupContainer`} data-projectid={this.props.projectId}/>
        </Card>
      </div>

    );
  }
}

export default ProjectCard;
