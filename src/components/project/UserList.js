import {Component} from 'react';
import {Input,Icon} from 'antd';
import Config from "../../utils/Config";
import projectPageStyles from '../../assets/css/projectPage.css';
import PublicAuthKit from '../../utils/PublicAuthKit';

class UserList extends Component{
  render(){
    return (
      <div style={{width: 270,height: 480,background: '#3333'}}>
        <div style={{
          height:44,
          borderBottom:'1px solid white',
          display:'flex',
          alignItems:'center',
          position:'relative'
        }}>
          <img className={projectPageStyles["own-avatar"]} src={`${Config.baseURL}/images/${PublicAuthKit.getItem('username')}.jpg` } alt='avatar' />
          <span style={{margin: '0 auto',fontSize: 16,fontWeight: 'bolder'}}>用户列表</span>
          <Icon type="menu-fold" style={{
            position: 'absolute',
            right: 10,
            fontSize: 15,
            cursor:'pointer'
          }} />
        </div>
        <div style={{
          height:28,
          borderBottom:'1px solid white',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <Input.Search
            placeholder="搜索用户"
            onSearch={value => console.log(value)}
            style={{ width: '100%' }}
            size='small'
          />
        </div>
        <div style={{height:408,borderBottom:'1px solid white'}}></div>
      </div>
    );
  }

}

export default UserList;
