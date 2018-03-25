import { observable,action,computed} from 'mobx';
import axios from 'axios';
import PublicAuthKit from '../utils/PublicAuthKit';
import Config from '../utils/Config';
import {message} from 'antd';

/* 全局配置baseURL和Content-Type类型 */
// axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.baseURL = Config.baseURL;
axios.defaults.headers['Content-Type'] = Config.ContentType;

class LoginStore {

  @observable loadingStatus = false;

  @computed get getLoadingStatus(){
    return this.loadingStatus;
  }

  @action setLoadingStatus(status) {
    this.loadingStatus = status;
  }

  /* 登陆成功后设置登陆状态并为全局header设置token */
  LoginSuccess(token,user) {
    PublicAuthKit.setItem('username',user['username']);
    PublicAuthKit.setItem('loginStatus',`${user['username']};login`);
    PublicAuthKit.setItem('token',`Bearer ${token}`);

    PublicAuthKit.addAuthHeader();
    // LoginStore.addAuthHeader(AuthSessionStorage.getItem('token'));
  }

  /* 根据token全局设置header */
  // static addAuthHeader(token){
  //   axios.defaults.headers['Authorization'] = token;
  // }

  /* 访问后台服务器获取token */
  getTokenFromWebServer(SysUser){
    return axios.post('/auth/',JSON.stringify(SysUser)).catch(err => {
      this.setLoadingStatus(false);
      console.log(err);
      let errMessage = null;
      if (err && err.response) {
        switch (err.response.status) {
          case 401:
            errMessage = '用户名或密码错误，请重试';
            break

          // case 403:
          //   err.message = '拒绝访问'
          //   break
          //
          // case 404:
          //   err.message = `请求地址出错: ${err.response.config.url}`
          //   break
          //
          // case 408:
          //   err.message = '请求超时'
          //   break
          //
          // case 500:
          //   err.message = '服务器内部错误'
          //   break
          //
          // case 501:
          //   err.message = '服务未实现'
          //   break
          //
          // case 502:
          //   err.message = '网关错误'
          //   break
          //
          // case 503:
          //   err.message = '服务不可用'
          //   break
          //
          // case 504:
          //   err.message = '网关超时'
          //   break
          //
          // case 505:
          //   err.message = 'HTTP版本不受支持'
          //   break

          default:
            errMessage = "网络错误，请稍后重试";
        }
      }else{
        errMessage = "网络连接超时，请稍后重试";
      }

      message.error(errMessage);
    })
  }

}
const loginStore = new LoginStore();
export default loginStore;
