// import { observable,action,computed} from 'mobx';
import axios from 'axios';
import PublicAuthKit from "../utils/PublicAuthKit";

class RegisterStore {
  constructor(){
    PublicAuthKit.addAuthHeader();
  }

  checkUsernameFromWebServer(username){
    return axios.get(`/user/checkUsername?username=${username}`).catch(err=>{
      console.log(err);
    });
  }
}

const registerStore = new RegisterStore();
export default registerStore;
