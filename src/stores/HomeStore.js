import { observable,action,computed} from 'mobx';
import {message} from 'antd';
import axios from 'axios';
import PublicAuthKit from "../utils/PublicAuthKit";

class HomeStore {
  constructor(){
    PublicAuthKit.addAuthHeader();
  }

  @observable showChangePasswordModal = false;
  @observable showPersonalInfoModal = false;
  @observable userInfoMaskLoadingStatus = true;
  @observable userInfo = {};
  @observable personalInfoButtonDisabled = true;
  @observable homePageMaskLoadingStatus = true;
  @observable projects = [];
  @observable showCreateProjectModal = false;
  @observable createProjectMaskLoadingStatus = false;

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
  @computed get getHomePageMaskLoadingStatus(){
    return this.homePageMaskLoadingStatus;
  }
  @computed get getProjects(){
    return this.projects;
  }
  @computed get getShowCreateProjectModal(){
    return this.showCreateProjectModal;
  }
  @computed get getCreateProjectMaskLoadingStatus(){
    return this.createProjectMaskLoadingStatus;
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
        this.getProjectFromWebServer(this.userInfo['username']).then(response=>{
          this.setHomePageMaskLoadingStatus(false);
          /* 无数据时返回的时null */
          if(response){
            this.setProjects(response.data);
          }else{
            message.error('网络错误，请稍后再试！');
          }
        });
      }else{
        this.setHomePageMaskLoadingStatus(false);
        message.error('网络错误，请稍后再试！');
      }
    });
  }

  @action setPersonalInfoButtonDisabled(status){
    this.personalInfoButtonDisabled = status;
  }

  @action setHomePageMaskLoadingStatus(status){
    this.homePageMaskLoadingStatus = status;
  }

  @action setProjects(projects){
    this.projects = projects;
  }

  @action setShowCreateProjectModal(status){
    this.showCreateProjectModal = status;
  }

  @action setCreateProjectMaskLoadingStatus(status){
    this.createProjectMaskLoadingStatus = status;
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

  getProjectFromWebServer(username){
    return axios.get(`project/getProject?username=${username}`).catch(err=>{
      console.log(err);
    });
  }

  createProject(project,username){
    return axios.post(`project/createProject?username=${username}`,JSON.stringify(project)).catch(err=>{
      console.log(err);
    });
  }
}

const homeStore = new HomeStore();
export default homeStore;
