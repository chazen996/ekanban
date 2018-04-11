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

  loadData(kanbanId){
    this.getAllDataFromWebServer(kanbanId).then(axios.spread((userInfo,projectInfo,kanbanInfo,columns)=>{
      this.setKanbanPageMaskLoadingStatus(false);
      if(userInfo&&projectInfo&&kanbanInfo&&columns){
        this.setUserInfo(userInfo.data);
        this.setProjectInfo(projectInfo.data);
        this.setKanbanInfo(kanbanInfo.data);
        this.setColumns(columns.data);
      }else{
        message.error('网络错误，请稍后再试！');
      }
    }))
  }

  getAllDataFromWebServer(kanbanId) {
    return axios.all([
      this.getPersonalInfoFromWebServer(this.username),
      this.getProjectInfoByKanbanIdFromWebServer(kanbanId),
      this.getKanbanInfoFromWebServer(kanbanId),
      this.getColumnsFromWebServer(kanbanId)
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

  getColumnsFromWebServer(kanbanId){
    return axios.get(`kanban/getColumns?kanbanId=${kanbanId}&username=${this.username}`).catch(err=>{
      console.log(err);
    });
  }

  getKanbanInfoFromWebServer(kanbanId){
    return axios.get(`kanban/getKanban?kanbanId=${kanbanId}&username=${this.username}`).catch(err=>{
      console.log(err);
    });
  }

}

const kanbanStore = new KanbanStore();
export default kanbanStore;
