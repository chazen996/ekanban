import {Component} from 'react';
import {Card,Icon} from 'antd';
import homePageStyles from '../../assets/css/homePage.css';

class ProjectCard extends Component{

  render(){
    const createdDateStr = this.props.createdDate;
    const createdDate = new Date(Date.parse(createdDateStr));
    return (
      <div className={homePageStyles["project-card"]}>
        <Card title={this.props.projectName} bordered={true}
              extra={
                <Icon type="ellipsis" style={{ fontSize: 18,cursor:'pointer'}}/>
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
        </Card>
      </div>

    );
  }
}

export default ProjectCard;
