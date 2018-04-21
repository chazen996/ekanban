import { observable,action,computed} from 'mobx';
import {message} from 'antd';
import axios from 'axios';
import PublicAuthKit from "../utils/PublicAuthKit";

class KanbanStore{
  constructor(){
    PublicAuthKit.addAuthHeader();
    this.username = PublicAuthKit.getItem('username');
  }

  @observable userInfo = {};
  @observable projectInfo = {};
  @observable kanbanInfo = {};
  @observable columns = [];
  @observable kanbanPageMaskLoadingStatus = true;
  @observable openedColumnSettingPanelId = -1;
  @observable swimlanes = [];
  @observable startColumnId = -1;
  @observable endColumnId = -1;
  @observable openedSprints = [];
  @observable stagingAreaMaskLoadingStatus = true;
  @observable showStagingArea = false;
  @observable cardUnderKanban = [];
  @observable showCreateCardModal = false;
  @observable createCardMaskLoadingStatus = false;
  @observable cardTypeChecked = 'story';
  @observable allUserUnderProject = [];
  @observable targetCard = {};
  @observable showEditCardModal = false;
  @observable editCardMaskLoadingStatus = false;
  @observable assignedPersonName = 0;

  @observable dragingCard = {};

  @computed get getAssignedPersonName(){
    return this.assignedPersonName;
  }

  @computed get getShowEditCardModal(){
    return this.showEditCardModal;
  }

  @computed get getEditCardMaskLoadingStatus(){
    return this.editCardMaskLoadingStatus;
  }

  @computed get getTargetCard(){
    return this.targetCard;
  }

  @computed get getAllUserUnderProject(){
    return this.allUserUnderProject;
  }

  @computed get getCardTypeChecked(){
    return this.cardTypeChecked;
  }

  @computed get getCreateCardMaskLoadingStatus(){
    return this.createCardMaskLoadingStatus;
  }

  @computed get getShowCreateCardModal(){
    return this.showCreateCardModal;
  }

  @computed get getDragingCard(){
    return this.dragingCardId;
  }

  @computed get getCardUnderKanban(){
    return this.cardUnderKanban;
  }

  @computed get getShowStagingArea(){
    return this.showStagingArea;
  }

  @computed get getStagingAreaMaskLoadingStatus(){
    return this.stagingAreaMaskLoadingStatus;
  }

  @computed get getOpenedSprints(){
    return this.openedSprints;
  }

  @computed get getStartColumnId(){
    return this.startColumnId;
  }

  @computed get getEndColumnId(){
    return this.endColumnId;
  }

  @computed get getSwimlanes(){
    return this.swimlanes;
  }

  @computed get getOpenedColumnSettingPanelId(){
    return this.openedColumnSettingPanelId;
  }

  @computed get getKanbanInfo(){
    return this.kanbanInfo;
  }

  @computed get getKanbanPageMaskLoadingStatus(){
    return this.kanbanPageMaskLoadingStatus;
  }

  @computed get getUserInfo(){
    return this.userInfo;
  }

  @computed get getProjectInfo(){
    return this.projectInfo;
  }

  @computed get getColumns(){
    return this.columns;
  }

  @action setAssignedPersonName(name){
    this.assignedPersonName = name;
  }

  @action setEditCardMaskLoadingStatus(status){
    this.editCardMaskLoadingStatus = status;
  }

  @action setShowEditCardModal(status){
    this.showEditCardModal = status;
  }

  @action setTargetCard(card){
    this.targetCard = card;
  }

  @action setAllUserUnderProject(allUserUnderProject){
    this.allUserUnderProject = allUserUnderProject;
  }

  @action setCardTypeChecked(type){
    this.cardTypeChecked = type;
  }


  @action setCreateCardMaskLoadingStatus(status){
    this.createCardMaskLoadingStatus = status;
  }

  @action setShowCreateCardModal(status){
    this.showCreateCardModal = status;
  }

  @action setDragingCard(card){
    this.dragingCardId = card;
  }

  @action setCardUnderKanban(cards){
    this.cardUnderKanban = cards;
  }

  @action setShowStagingArea(status){
    this.showStagingArea = status;
  }

  @action setStagingAreaMaskLoadingStatus(status){
    this.stagingAreaMaskLoadingStatus = status;
  }

  @action set0penedSprints(sprints){
    this.openedSprints = sprints;
  }

  @action setStartColumnId(columnId){
    this.startColumnId = columnId;
  }

  @action setEndColumnId(columnId){
    this.endColumnId = columnId;
  }

  @action setSwimlanes(swimlanes){
    this.swimlanes = swimlanes;
  }

  @action setOpenedColumnSettingPanelId(columnId){
    this.openedColumnSettingPanelId = columnId;
  }

  @action setKanbanInfo(kanban){
    this.kanbanInfo = kanban;
  }

  @action setKanbanPageMaskLoadingStatus(status){
    this.kanbanPageMaskLoadingStatus = status;
  }

  @action setUserInfo(user){
    this.userInfo = user;
  }

  @action setProjectInfo(project){
    this.projectInfo = project;
  }

  @action setColumns(columns){
    this.columns = columns;
  }

  loadData(kanbanId,checkAuth){
    this.getAllDataFromWebServer(kanbanId).then(axios.spread((userInfo,projectInfo,kanbanInfo,kanbanData,cardUnderKanban,allUser)=>{
      this.setKanbanPageMaskLoadingStatus(false);
      this.setShowEditCardModal(false);

      if(userInfo&&projectInfo&&kanbanInfo&&kanbanData&&cardUnderKanban&&allUser){
        if(checkAuth&&userInfo.data.id!==projectInfo.data.createdBy){
          window.location.href='/kanban/'+kanbanInfo.data.kanbanId;
          return;
        }
        this.setUserInfo(userInfo.data);
        this.setProjectInfo(projectInfo.data);
        this.setKanbanInfo(kanbanInfo.data);
        this.setColumns(kanbanData.data.columns);
        this.setSwimlanes(kanbanData.data.swimlanes);
        this.setCardUnderKanban(cardUnderKanban.data);

        this.setAllUserUnderProject(allUser.data);
      }else{
        message.error('网络错误，请稍后再试！');
      }
    }))
  }

  loadSprints(kanbanId){
    this.getOpenedSprintsFromWebServer(kanbanId).then(response=>{
      this.setStagingAreaMaskLoadingStatus(false);
      if(response){
        this.set0penedSprints(response.data);
      }else{
        message.error('网络错误，请稍后再试！');
      }
    });
  }

  getAllDataFromWebServer(kanbanId) {
    return axios.all([
      this.getPersonalInfoFromWebServer(this.username),
      this.getProjectInfoByKanbanIdFromWebServer(kanbanId),
      this.getKanbanInfoFromWebServer(kanbanId),
      this.getKanbanDataFromWebServer(kanbanId),
      this.getCardUnderKanbanFromWebServer(kanbanId),
      this.getAllUserUnderProjectByKanbanIdFromWebServer(kanbanId)
    ]).catch(err => {
      console.log(err);
    });
  }

  getProjectInfoByKanbanIdFromWebServer(kanbanId){
    return axios.get(`kanban/getProjectByKanbanId?kanbanId=${kanbanId}&username=${this.username}`).catch(err=>{
      console.log(err);
    });
  }

  getPersonalInfoFromWebServer(username){
    return axios.get(`user/getPersonalInfo?targetUsername=${username}`).catch(err=>{
      console.log(err);
    })
  }

  getKanbanDataFromWebServer(kanbanId){
    return axios.get(`kanban/getKanbanData?kanbanId=${kanbanId}&username=${this.username}`).catch(err=>{
      console.log(err);
    });
  }

  getKanbanInfoFromWebServer(kanbanId){
    return axios.get(`kanban/getKanban?kanbanId=${kanbanId}&username=${this.username}`).catch(err=>{
      console.log(err);
    });
  }

  saveKanbanData(kanbanData){
    return axios.post(`kanban/saveKanbanData?username=${this.username}`,JSON.stringify(kanbanData)).catch(err=>{
      console.log(err);
    });
  }

  getOpenedSprintsFromWebServer(kanbanId){
    return axios.get(`kanban/getOpenedSprints?username=${this.username}&kanbanId=${kanbanId}`).catch(err=>{
      console.log(err);
    });
  }

  getCardUnderKanbanFromWebServer(kanbanId){
    return axios.get(`kanban/getCardUnderKanban?username=${this.username}&kanbanId=${kanbanId}`).catch(err=>{
      console.log(err);
    });
  }

  deleteUnusualCard(cardIdList){
    return axios.post(`kanban/deleteUnusualCard?username=${this.username}`,JSON.stringify(cardIdList)).catch(err=>{
      console.log(err);
    });
  }

  deleteCard(card){
    return axios.post(`card/deleteCard?username=${this.username}`,JSON.stringify(card)).catch(err=>{
      console.log()
    });
  }

  moveCard(card){
    return axios.post(`kanban/moveCard?username=${this.username}`,JSON.stringify(card)).catch(err=>{
      console.log(err);
    });
  }

  createCard(card){
    return axios.post(`card/createCard?username=${PublicAuthKit.getItem('username')}`,JSON.stringify(card)).catch(err=>{
      console.log(err);
    });
  }

  getAllUserUnderProjectByKanbanIdFromWebServer(kanbanId){
    return axios.get(`kanban/getAllUserUnderProjectByKanbanId?kanbanId=${kanbanId}&username=${this.username}`).catch(err=>{
      console.log(err);
    });
  }

  updateCard(card){
    return axios.post(`card/updateCard?username=${this.username}`,JSON.stringify(card)).catch(err=>{
      console.log(err);
    });
  }
}

const kanbanStore = new KanbanStore();
export default kanbanStore;
