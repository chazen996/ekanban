// import { observable,action,computed,autorun} from 'mobx';
import axios from 'axios';
import AuthSessionStorage from '../utils/AuthSessionStorage';

/* 全局配置baseURL和Content-Type类型 */
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.headers['Content-Type'] = 'application/json';

class LoginStore {

  /* 登陆成功后设置登陆状态并为全局header设置token */
  LoginSuccess(token,user) {
    AuthSessionStorage.setItem('username',user['username']);
    AuthSessionStorage.setItem('loginStatus',`${user['username']};login`);

    LoginStore.addAuthHeader(`Bearer ${token}`);
  }

  /* 根据token全局设置header */
  static addAuthHeader(token){
    axios.defaults.headers.common['Authorization'] = token;
  }

  /* 访问后台服务器获取token */
  getTokenFromWebServer(SysUser){
    return axios.post('/auth/',JSON.stringify(SysUser)).catch(error => {
      console.log(error);
    })
  }

}
const loginStore = new LoginStore();
export default loginStore;
