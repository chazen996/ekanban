import { observable,action,computed} from 'mobx';
import {message} from 'antd';
import axios from 'axios';
import PublicAuthKit from "../utils/PublicAuthKit";


class ProjectStore{
  constructor(){
    PublicAuthKit.addAuthHeader();
  }

  @observable allUserUnderProject = [];
  @observable projectPageMaskLoadingStatus=true;
  @observable userInfo = {};

  @computed get getAllUserUnderProject(){
    return this.allUserUnderProject;
  }

  @computed get getProjectPageMaskLoadingStatus(){
    return this.projectPageMaskLoadingStatus;
  }

  @computed get getUserInfo(){
    return this.userInfo;
  }

  @action setUserInfo(userInfo){
    this.userInfo = userInfo;
  }

  @action setAllUserUnderProject(allUserUnderProject){
    this.allUserUnderProject = allUserUnderProject;
  }

  @action loadData(projectId){
    this.getAllDataFromWebServer(projectId).then(axios.spread((personalInfo,targetProject,allUserUnderProject)=>{
      this.setProjectPageMaskLoadingStatus(false);
      if(personalInfo&&targetProject&&allUserUnderProject){
        this.setUserInfo(personalInfo.data);
        this.setAllUserUnderProject(allUserUnderProject.data);
      }else{
        message.error('网络错误，请稍后再试！');
      }
    }));


    // this.getTargetProjectFromWebServer(projectId).then(response=>{
    //   if(response){
    //     this.getAllUserUnderProjectFromWebServer(projectId,PublicAuthKit.getItem('username')).then(response=>{
    //       if(response){
    //         this.setProjectPageMaskLoadingStatus(false);
    //         this.allUserUnderProject = response.data;
    //       }else{
    //         message.error('网络错误，请稍后再试！');
    //       }
    //     });
    //   }else{
    //     this.setProjectPageMaskLoadingStatus(false);
    //     message.error('网络错误，请稍后再试！');
    //   }
    // });
  }
  @action getAllDataFromWebServer(projectId){
    return axios.all([
      this.getPersonalInfo(PublicAuthKit.getItem('username')),
      this.getTargetProjectFromWebServer(projectId),
      this.getAllUserUnderProjectFromWebServer(projectId,PublicAuthKit.getItem('username'))
    ]).catch(err=>{
      console.log(err);
    });
  }

  getPersonalInfo(username){
    return axios.get(`user/getPersonalInfo?targetUsername=${username}`).catch(err=>{
      console.log(err);
    })
  }

  @action setProjectPageMaskLoadingStatus(status){
    this.projectPageMaskLoadingStatus = status;
  }

  getAllUserUnderProjectFromWebServer(projectId,username){
    return axios.get(`project/getAllUserUnderProject?projectId=${projectId}&username=${username}`).catch(err=>{
      console.log(err);
    });
  }

  removeUserFromProject(projectId,userId){
    return axios.get(`project/removeUserFromProject?projectId=${projectId}&userId=${userId}&username=${PublicAuthKit.getItem('username')}`).catch(err=>{
      console.log(err);
    });
  }

  getUserLikeTheUsername(targetUsername){
    return axios.get(`project/getUserLikeTheUsername?targetUsername=${targetUsername}&username=${PublicAuthKit.getItem('username')}`).catch(err=>{
      console.log(err);
    });
  }

  addUserIntoProject(projectId,userId){
    return axios.get(`project/addUserIntoProject?projectId=${projectId}&userId=${userId}&username=${PublicAuthKit.getItem('username')}`).catch(err=>{
      console.log(err);
    })
  }

  getTargetProjectFromWebServer(projectId){
    return axios.get(`project/getTargetProject?projectId=${projectId}&username=${PublicAuthKit.getItem('username')}`).catch(err=>{
      console.log(err);
    });
  }
}

const projectStore = new ProjectStore();
export default projectStore;
