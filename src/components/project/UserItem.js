import {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Icon,Row,Col} from 'antd';
import projectPageStyles from "../../assets/css/projectPage.css";
import Config from "../../utils/Config";
import ProjectStore from "../../stores/ProjectStore";
// import ProjectStore from '../../stores/ProjectStore';

class UserItem extends Component{
  handleOnRemoveUser(userId){
    this.props.handleOnRemoveUser(userId);
  }
  handleOnChangeControlRight(userId){
    this.props.handleOnChangeControlRight(userId);
  }
  render(){
    let operable = {
      removable:true,
      assignable:false,
    };
    const userInfo = ProjectStore.getUserInfo;
    const projectInfo = ProjectStore.getProjectInfo;
    if (userInfo.id === projectInfo.createdBy) {
      operable.assignable = true;
    }
    if(this.props.user.id === projectInfo.createdBy){
      operable.removable = false;
    }
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
                <div>
                  <span>{this.props.user.username}</span>
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
              </Col>
            </Row>
            <Row>
              <Col span={7} offset={1}>
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
          justifyContent:'space-evenly',
          alignItems:'center',
          width:70,
        }}>
          {
            operable.removable?(
              <Icon type="close" style={{fontSize: 18,color: '#ff4d4f',cursor:'pointer',fontStyle: 'italic'}} onClick={this.handleOnRemoveUser.bind(this,this.props.user.id)}/>
            ):(
              <Icon type="close" style={{fontSize: 18,color: 'rgba(0,0,0,0.45)',cursor:'not-allowed',fontStyle: 'italic'}} />
            )
          }
          {
            operable.assignable?(
              <Icon type="fork"  style={{fontSize: 12,color: 'blue',cursor:'pointer',fontStyle: 'italic'}} onClick={this.handleOnChangeControlRight.bind(this,this.props.user.id)}/>
            ):(
              <Icon type="fork"  style={{fontSize: 12,color: 'rgba(0,0,0,0.45)',cursor:'not-allowed',fontStyle: 'italic'}}/>
            )
          }
        </div>
      </div>
    );
  }
}

export default withRouter(UserItem);
