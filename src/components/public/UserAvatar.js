import {Component} from 'react';
import {Dropdown,Menu,message} from 'antd';
import {observer} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import HomeStore from '../../stores/HomeStore';
import Config from '../../utils/Config';
import homePageStyles from "../../assets/css/homePage.css";
import PublicAuthKit from "../../utils/PublicAuthKit";

@observer
class UserAvatar extends Component{

  render(){
    return (
      <Dropdown overlay={(
        <Menu>
          <Menu.Item>
            <a href="javascript:void(0)" onClick={()=>{
              HomeStore.setShowChangePasswordModal(true);
            }}>修改密码</a>
          </Menu.Item>
          <Menu.Item>
            <a href="javascript:void(0)" onClick={()=>{
              HomeStore.setShowPersonalInfoModal(true);
              HomeStore.setUserInfoMaskLoadingStatus(true);
              HomeStore.getPersonalInfo(PublicAuthKit.getItem('username')).then(response=>{
                HomeStore.setUserInfoMaskLoadingStatus(false);
                if(response){
                  HomeStore.setUserInfo(response.data);
                }else{
                  message.error('网络错误，请稍后再试！');
                }
              });
              // HomeStore.loadUserInfoFromWebServer(PublicAuthKit.getItem('username'));
            }}>个人信息</a>
          </Menu.Item>
          <Menu.Divider/>
          <Menu.Item>
            <a href="javascript:void(0)" onClick={this.props.handleOnLogOut}>退出登陆</a>
          </Menu.Item>
        </Menu>
      )}>
        <img className={homePageStyles["user-avatar"]} src={`${Config.baseURL}/images/${this.props.username}.jpg` } alt='avatar' />
      </Dropdown>
    );
  }
}

export default withRouter(UserAvatar);
