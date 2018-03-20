import { observable,action,computed } from 'mobx';
import axios from 'axios';

/* 全局配置baseURL和Content-Type类型 */
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.headers['Content-Type'] = 'application/json';

class LoginStore {
  /* token保存从后台获取token信息；loginStatus控制登陆状态 */
  @observable token=null;
  @observable loginStatus = false;


  @computed get getToken() {
    return this.token;
  }

  @computed get getLoginStatus(){
    return this.loginStatus;
  }

  /* 登陆成功后设置登陆状态并为全局header设置token */
  @action LoginSuccess(token) {
    this.token = token;
    LoginStore.addAuthHeader(`Bearer ${token}`);
    this.loginStatus = true;
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

  testUser(){
    return axios.get('/users').catch(error => {
      console.log(error);
    });
  }

}
const loginStore = new LoginStore();
export default loginStore;
