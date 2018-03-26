// import { observable,action,computed} from 'mobx';
import axios from 'axios';
import PublicAuthKit from "../utils/PublicAuthKit";

class RegisterStore {
  constructor(){
    PublicAuthKit.addAuthHeader();
  }

  // @observable uploading = false;
  //
  // @computed get getUploading(){
  //   return this.uploading;
  // }
  //
  // @action setUploading(status){
  //   this.uploading = status;
  // }

  checkUsernameFromWebServer(username){
    return axios.get(`/auth/checkUsername?username=${username}`).catch(err=>{
      console.log(err);
    });
  }

  registerUser(user,tempAvatarName){
    return axios.post(`/auth/register?tempAvatarName=${tempAvatarName}`,JSON.stringify(user)).catch(err=>{
      console.log(err);
    });
  }
}

const registerStore = new RegisterStore();
export default registerStore;
