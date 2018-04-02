import {Component} from 'react';

import {Icon,Row,Col,message} from 'antd';
import projectPageStyles from "../../assets/css/projectPage.css";
import Config from "../../utils/Config";
import ProjectStore from '../../stores/ProjectStore';

class UserItem extends Component{
  handleOnRemoveUser(userId){
    /* 获取projectId */
    const projectId = 26;
    ProjectStore.removeUserFromProject(projectId,userId).then(response=>{
      if(response){
        if(response.data==="success"){
          message.success('移除用户成功！');
          ProjectStore.loadData(projectId);
        }else if(response.data==="failure"){
          message.error('移除用户失败，请稍后再试！');
        }
      }else{
        message.error('网络错误，请稍后再试！');
      }
    });
  }
  render(){

    return (
      <div className={projectPageStyles["user-item-container"]}>
        <div style={{
          display:'flex',
          justifyContent:'center',
          alignItems:'center',
          width:66,
        }}>
          <img style={{
            borderRadius: 100,
            width: 40,
            height: 40,
            userSelect: 'none'
          }} src={`${Config.baseURL}/images/${this.props.user.username}.jpg` } alt='avatar' />
        </div>
        <div style={{
          width:174,
          fontSize:12,
          position:'relative'
        }}>
          <div style={{
            position: 'relative',
            top: '50%',
            transform: 'translateY(-50%)'
          }}>
            <Row>
              <Col span={8}>
                <span>用户名:</span>
              </Col>
              <Col span={16}>
                <div>{this.props.user.username}</div>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <span>邮箱:</span>
              </Col>
              <Col span={16}>
                <div>{this.props.user.emailAddress}</div>
              </Col>
            </Row>
          </div>

        </div>
        <div style={{
          display:'flex',
          justifyContent:'center',
          alignItems:'center',
          width:70,
        }}>
          <Icon type="close" style={{fontSize: 18,color: '#ff4d4f',cursor:'pointer',fontStyle: 'italic'}} onClick={this.handleOnRemoveUser.bind(this,this.props.user.id)}/>
        </div>
      </div>
    );
  }
}

export default UserItem;
