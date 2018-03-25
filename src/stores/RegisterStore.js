// import { observable,action,computed} from 'mobx';
import axios from 'axios';
import PublicAuthKit from "../utils/PublicAuthKit";

class RegisterStore {
  constructor(){
    PublicAuthKit.addAuthHeader();
  }
  // @observable showChangePasswordModal = false;
  // @computed get getShowChangePasswordModal(){
  //   return this.showChangePasswordModal;
  // }
  // @action setShowChangePasswordModal(status){
  //   this.showChangePasswordModal = status;
  // }

  checkUsernameFromWebServer(username){
    return axios.get(`/user/checkUsername?username=${username}`).catch(err=>{
      console.log(err);
    });
  }

  /* 根据token全局设置header */
  // static addAuthHeader(token){
  //   axios.defaults.headers['Authorization'] = token;
  // }
}

const registerStore = new RegisterStore();
export default registerStore;
