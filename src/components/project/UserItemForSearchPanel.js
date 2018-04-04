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
  }
  render(){
    const allUserUnderProject = ProjectStore.getAllUserUnderProject;
    let operable = {
      addable:true,
      removable:false,
    };
    for(let item of allUserUnderProject){
      if(item.id===this.props.user.id){
        operable['addable'] = false;
        operable['removable'] = true;
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
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          width: 54,
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
        </div>
      </div>
    );
  }
}

export default withRouter(UserItemForSearchPanel);
