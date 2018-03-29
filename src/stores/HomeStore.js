import { observable,action,computed} from 'mobx';
import axios from 'axios';
import PublicAuthKit from "../utils/PublicAuthKit";

class HomeStore {
  constructor(){
    PublicAuthKit.addAuthHeader();
  }

  @observable showChangePasswordModal = false;
  @observable showPersonalInfoModal = false;
  @observable userInfoMaskLoadingStatus = false;
  @observable userInfo = {};
  @observable personalInfoButtonDisabled = true;

  @computed get getShowChangePasswordModal(){
    return this.showChangePasswordModal;
  }

  @computed get getShowPersonalInfoModal(){
    return this.showPersonalInfoModal;
  }

  @computed get getUserInfoMaskLoadingStatus(){
    return this.userInfoMaskLoadingStatus;
  }
  @computed get getUserInfo(){
    return this.userInfo;
  }
  @computed get getPersonalInfoButtonDisabled(){
    return this.personalInfoButtonDisabled;
  }

  @action setShowChangePasswordModal(status){
    this.showChangePasswordModal = status;
  }

  @action setShowPersonalInfoModal(status){
    this.showPersonalInfoModal = status;
  }

  @action setUserInfoMaskLoadingStatus(status){
    this.userInfoMaskLoadingStatus = status;
  }

  @action loadUserInfoFromWebServer(username){
    this.getPersonalInfo(username).then(response=>{
      this.setUserInfoMaskLoadingStatus(false);
      if(response){
        this.userInfo = response.data;
      }
    });
  }

  @action setPersonalInfoButtonDisabled(status){
    this.personalInfoButtonDisabled = status;
  }

  updatePassword(user,oldPassword){
    return axios.post(`user/updatePassword?oldPassword=${oldPassword}`,JSON.stringify(user)).catch(err=>{
      console.log(err);
    });
  }

  getPersonalInfo(username){
    return axios.get(`user/getPersonalInfo?targetUsername=${username}`).catch(err=>{
      console.log(err);
    })
  }

  changeUserAvatar(username){
    return axios.get(`user/changeUserAvatar?username=${username}`).catch(err=>{
      console.log(err);
    });
  }
}

const homeStore = new HomeStore();
export default homeStore;
