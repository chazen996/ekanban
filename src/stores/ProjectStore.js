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
  @observable projectInfo = {};
  @observable sprints = [];
  @observable showCreateSprintModal = false;
  @observable createSprintMaskLoadingStatus = false;
  @observable showEditOrViewSprintModal = false;
  @observable targetSprintId = -1;
  @observable editOrViewSprintMaskLoadingStatus = false;
  @observable editOrView = 'edit';
  @observable cardTypeChecked = 'story';
  @observable showCreateCardModal = false;
  @observable createCardMaskLoadingStatus = false;
  @observable targetCard = {};
  @observable showEditOrViewCardModal = false;
  @observable editOrViewCardMaskLoadingStatus = false;

  @computed get getEditOrViewCardMaskLoadingStatus(){
    return this.editOrViewCardMaskLoadingStatus;
  }
  @computed get getShowEditOrViewCardModal(){
    return this.showEditOrViewCardModal;
  }

  @computed get getTargetCard(){
    return this.targetCard;
  }

  @computed get getCreateCardMaskLoadingStatus(){
    return this.createCardMaskLoadingStatus;
  }

  @computed get getShowCreateCardModal(){
    return this.showCreateCardModal;
  }

  @computed get getCardTypeChecked(){
    return this.cardTypeChecked;
  }
  @computed get getAllUserUnderProject(){
    return this.allUserUnderProject;
  }

  @computed get getProjectPageMaskLoadingStatus(){
    return this.projectPageMaskLoadingStatus;
  }

  @computed get getUserInfo(){
    return this.userInfo;
  }

  @computed get getProjectInfo(){
    return this.projectInfo;
  }

  @computed get getSprints(){
    return this.sprints;
  }

  @computed get getShowCreateSprintModal(){
    return this.showCreateSprintModal;
  }

  @computed get getCreateSprintMaskLoadingStatus(){
    return this.createSprintMaskLoadingStatus;
  }

  @computed get getShowEditOrViewSprintModal(){
    return this.showEditOrViewSprintModal;
  }

  @computed get getTargetSprintId(){
    return this.targetSprintId;
  }

  @computed get getEditOrViewSprintMaskLoadingStatus(){
    return this.editOrViewSprintMaskLoadingStatus;
  }

  @computed get getEditOrView(){
    return this.editOrView;
  }

  @action setEditOrViewCardMaskLoadingStatus(status){
    this.editOrViewCardMaskLoadingStatus = status;
  }

  @action setShowEditOrViewCardModal(status){
    this.showEditOrViewCardModal = status;
  }

  @action setTargetCard(card){
    this.targetCard = card;
  }

  @action setCreateCardMaskLoadingStatus(status){
    this.createCardMaskLoadingStatus = status;
  }

  @action setShowCreateCardModal(status){
    this.showCreateCardModal = status;
  }

  @action setCardTypeChecked(type){
    this.cardTypeChecked = type;
  }

  @action setEditOrView(status){
    this.editOrView = status;
  }

  @action setEditOrViewSprintMaskLoadingStatus(status){
    this.editOrViewSprintMaskLoadingStatus = status;
  }

  @action setTargetSprintId(sprintId){
    this.targetSprintId = sprintId;
  }

  @action setShowEditOrViewSprintModal(status){
    this.showEditOrViewSprintModal = status;
  }

  @action setCreateSprintMaskLoadingStatus(status){
    this.createSprintMaskLoadingStatus = status;
  }

  @action setShowCreateSprintModal(status){
    this.showCreateSprintModal = status;
  }

  @action setSprints(sprints){
    this.sprints = sprints;
  }

  @action setProjectInfo(project){
    this.projectInfo = project;
  }

  @action setUserInfo(userInfo){
    this.userInfo = userInfo;
  }

  @action setAllUserUnderProject(allUserUnderProject){
    this.allUserUnderProject = allUserUnderProject;
  }

  @action loadData(projectId){
    this.getAllDataFromWebServer(projectId).then(axios.spread((personalInfo,targetProject,allUserUnderProject,sprints)=>{
      this.setProjectPageMaskLoadingStatus(false);
      if(personalInfo&&targetProject&&allUserUnderProject&&sprints){
        this.setUserInfo(personalInfo.data);
        this.setProjectInfo(targetProject.data);
        this.setAllUserUnderProject(allUserUnderProject.data);
        this.setSprints(sprints.data);
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
      this.getAllUserUnderProjectFromWebServer(projectId,PublicAuthKit.getItem('username')),
      this.getSprintsFromWebServer(projectId)
    ]).catch(err=>{
      console.log(err);
    });
  }

  getSprintsFromWebServer(projectId){
    return axios.get(`sprint/getSprint?username=${PublicAuthKit.getItem('username')}&projectId=${projectId}`).catch(err=>{
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

  changeProjectControlRight(projectId,userId){
    return axios.get(`project/changeProjectControlRight?projectId=${projectId}&userId=${userId}&username=${PublicAuthKit.getItem('username')}`).catch(err=>{
      console.log(err);
    });
  }

  createSprint(sprint){
    return axios.post(`sprint/createSprint?username=${PublicAuthKit.getItem('username')}`,JSON.stringify(sprint)).catch(err=>{
      console.log(err);
    });
  }

  updateSprint(sprint){
    return axios.post(`sprint/updateSprint?username=${PublicAuthKit.getItem('username')}`,JSON.stringify(sprint)).catch(err=>{
      console.log(err);
    });
  }

  createCard(card){
    return axios.post(`card/createCard?username=${PublicAuthKit.getItem('username')}`,JSON.stringify(card)).catch(err=>{
      console.log(err);
    });
  }

  openOrCloseSprint(sprint){
    return axios.post(`sprint/openOrCloseSprint?username=${PublicAuthKit.getItem('username')}`,JSON.stringify(sprint)).catch(err=>{
      console.log(err);
    });
  }

  deleteSprint(sprint){
    return axios.post(`sprint/deleteSprint?username=${PublicAuthKit.getItem('username')}`,JSON.stringify(sprint)).catch(err=>{
      console.log(err);
    });
  }

  deleteCard(card){
    return axios.post(`card/deleteCard?username=${PublicAuthKit.getItem('username')}`,JSON.stringify(card)).catch(err=>{
      console.log(err);
    });
  }

  updateCard(card){
    return axios.post(`card/updateCard?username=${PublicAuthKit.getItem('username')}`,JSON.stringify(card)).catch(err=>{
      console.log(err);
    });
  }
}

const projectStore = new ProjectStore();
export default projectStore;
