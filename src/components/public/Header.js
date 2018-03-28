import {Component} from 'react';
import Navigator from './Navigator';
import {Modal} from 'antd';
import {observer} from 'mobx-react';
// require('../../assets/css/header.css');
import PublicuthKit from "../../utils/PublicAuthKit";
import headStyles from "../../assets/css/header.css";
import UserAvatar from "./UserAvatar";
import HomeStore from "../../stores/HomeStore";

const board = require('../../assets/images/board-vertical.png');
const projectName = require('../../assets/images/project-name.png');

@observer
class Header extends Component{

  render(){
    return(
      <div className={headStyles["header-container"]}>
        <img src={board} alt='board logo' style={{height: '72%',marginLeft:'3%',userSelect:'none'}}/>
        <img src={projectName} alt='project name' style={{height:'65%',marginLeft:'1%',userSelect:'none'}}/>
        <Navigator naviData={this.props.naviData}/>
        <UserAvatar username={PublicuthKit.getItem('username')}/>


        <Modal
          title="修改密码"
          visible={HomeStore.getShowChangePasswordModal}
          okText="确认"
          cancelText="取消"
          onCancel={()=>{
            HomeStore.setShowChangePasswordModal(false);
          }}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </div>
    );
  }

}
export default Header;
