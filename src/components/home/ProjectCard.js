import {Component} from 'react';
import {Card,Icon,Dropdown,Menu} from 'antd';
import {withRouter} from 'react-router-dom';
import homePageStyles from '../../assets/css/homePage.css';

class ProjectCard extends Component{

  handleOnDeleteProject=(projectId)=>{
    this.props.handleOnDeleteProject(projectId);
  };

  handleOnEditProject=(projectId)=>{
    this.props.handleOnEditProject(projectId);
  };
  render(){
    const createdDateStr = this.props.createdDate;
    const createdDate = new Date(Date.parse(createdDateStr));
    const projectId = this.props.projectId;
    return (
      <div className={homePageStyles["project-card"]}>
        <Card title={this.props.projectName} bordered={true}
              extra={
                this.props.operable?(
                  <Dropdown overlay={(
                    <Menu>
                      <Menu.Item>
                        <a href="javascript:void(0)" onClick={()=>{
                          this.props.handleOnEditProject(this.props.projectId);
                        }}>编辑</a>
                      </Menu.Item>
                      <Menu.Item>
                        <a href="javascript:void(0)" onClick={()=>{
                          this.props.handleOnDeleteProject(this.props.projectId);
                        }}>删除</a>
                      </Menu.Item>
                    </Menu>
                  )} getPopupContainer={()=>document.getElementById(`${this.props.projectId}-popupContainer`)}>
                    <Icon type="ellipsis" style={{ fontSize: 18,cursor:'pointer'}}/>
                  </Dropdown>
                ):(
                  <Icon type="ellipsis" style={{ fontSize: 18,cursor:'not-allowed',color:'rgba(0,0,0,0.45)'}}/>
                )
              }>
          <div style={{height:75,cursor:'pointer'}} onClick={()=>{
            this.props.history.push(`/project/${projectId}`);
          }}>
            <div style={{height:42,textOverflow:'ellipsis', display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: '2',
              overflow: 'hidden'}}>{this.props.projectDescription}</div>
            <div style={{
              position: 'absolute',
              bottom: 20,
              right: 24
            }}><span style={{fontSize:12,color:'rgba(0,0,0,0.45)'}}>{`${createdDate.getFullYear()}年${createdDate.getMonth()+1}月${createdDate.getDate()}日`}</span></div>
          </div>
          <div id={`${this.props.projectId}-popupContainer`}/>
        </Card>
      </div>

    );
  }
}

export default withRouter(ProjectCard);
