import {Component} from 'react';
import {Icon,message} from 'antd';
import {observer} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import ProjectStore from '../../stores/ProjectStore';
import Config from "../../utils/Config";

@observer
class UserItemForSearchPanel extends Component{
  handleOnAddUser=(userId)=>{
    const projectId = this.props.match.params.projectId;
    ProjectStore.addUserIntoProject(projectId,userId).then(response=>{
      if(response){
        if(response.data==='success'){
          message.success('添加成功！');
          ProjectStore.loadData(projectId);
        }else{
          message.error('添加失败，请稍后再试');
        }
      }else{
        message.error('网络错误，请稍后再试！');
      }
    });
  }

  handleOnRemoveUser=(userId)=>{
    this.props.handleOnRemoveUser(userId);
  };

  handleOnChangeControlRight=(userId)=>{
    this.props.handleOnChangeControlRight(userId);
  };
  render(){
    const allUserUnderProject = ProjectStore.getAllUserUnderProject;
    const userInfo = ProjectStore.getUserInfo;
    const projectInfo = ProjectStore.getProjectInfo;
    let operable = {
      addable:true,
      removable:false,
      assignable:false,
    };
    for(let item of allUserUnderProject) {
      if (item.id === this.props.user.id) {
        operable['addable'] = false;
        if(item.id!==projectInfo.createdBy){
          operable['removable'] = true;
        }
        if (userInfo.id === projectInfo.createdBy) {
          operable.assignable = true;
        }
        break;
      }
    }
      return (
        <div style={{
          display:'flex',
          height:50,
          borderBottom: '1px solid #e8e8e88c',
          position:'relative'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 120,
            fontStyle: 'italic',
            marginLeft:40
          }}>
            <img style={{
              borderRadius: 100,
              width: 30,
              height: 30,
              userSelect: 'none',
              left:40,
              position:'absolute'
            }} src={`${Config.baseURL}/images/${this.props.user.username}.jpg` } alt='avatar' />
            {this.props.user.username}
            {projectInfo.createdBy===this.props.user.id?(
              <span style={{
                fontSize: 12,
                color: 'orange',
                border: '1px solid',
                borderRadius: 3,
                marginLeft: 2
              }}>组长</span>
            ):(null)}
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            width: 80,
          }}>
            {operable.addable?(
              <Icon type="user-add" style={{
                color:'blue',
                cursor:'pointer'
              }} onClick={this.handleOnAddUser.bind(this,this.props.user.id)}/>
            ):(
              <Icon type="user-add" style={{
                color:'rgba(0,0,0,0.45)',
                cursor:'not-allowed'
              }}/>
            )}
            {operable.removable?(
              <Icon type="user-delete" style={{
                color:'red',
                cursor:'pointer'
              }} onClick={this.handleOnRemoveUser.bind(this,this.props.user.id)}/>
            ):(
              <Icon type="user-delete" style={{
                color:'rgba(0,0,0,0.45)',
                cursor:'not-allowed'
              }}/>
            )}
            {
              operable.assignable?(
                <Icon type="fork"  style={{fontSize: 12,color: 'blue',cursor:'pointer'}} onClick={this.handleOnChangeControlRight.bind(this,this.props.user.id)}/>
              ):(
                <Icon type="fork"  style={{fontSize: 12,color:'rgba(0,0,0,0.45)', cursor:'not-allowed'}}/>
              )
            }
          </div>
        </div>
      );
  }
}

export default withRouter(UserItemForSearchPanel);
