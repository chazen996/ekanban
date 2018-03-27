import {Component} from 'react';
import {Dropdown,Menu} from 'antd';
import {observer} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import HomeStore from '../../stores/HomeStore';
import Config from '../../utils/Config';
import headStyles from "../../assets/css/header.css";
import PublicAuthKit from "../../utils/PublicAuthKit";

@observer
class UserAvatar extends Component{
  handleOnChangePassword = ()=>{
    HomeStore.setShowChangePasswordModal(true);
  }

  handleOnLogOut = ()=>{
    /* 清除登陆信息并将页面重定向到login页面;清除token信息（header无需移除，每个store的header需要自行重新设置） */
    PublicAuthKit.removeItem('username');
    PublicAuthKit.removeItem('loginStatus');
    PublicAuthKit.removeItem('token');

    this.props.history.push("/login");
  }

  render(){
    return (
      <Dropdown overlay={(
        <Menu>
          <Menu.Item>
            <a href="javascript:void(0)" onClick={this.handleOnChangePassword}>修改密码</a>
          </Menu.Item>
          <Menu.Item>
            <a href="javascript:void(0)">个人信息</a>
          </Menu.Item>
          <Menu.Divider/>
          <Menu.Item>
            <a href="javascript:void(0)" onClick={this.handleOnLogOut}>退出登陆</a>
          </Menu.Item>
        </Menu>
      )}>
        <img className={headStyles["user-avatar"]} src={`${Config.baseURL}/images/${this.props.username}.jpg` } alt='avatar' />
      </Dropdown>
    );
  }
}

export default withRouter(UserAvatar);
