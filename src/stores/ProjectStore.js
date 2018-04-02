import { observable,action,computed} from 'mobx';
import {message} from 'antd';
import axios from 'axios';
import PublicAuthKit from "../utils/PublicAuthKit";


class ProjectStore{
  constructor(){
    PublicAuthKit.addAuthHeader();
  }

  @observable allUserUnderProject = [];

  @computed get getAllUserUnderProject(){
    return this.allUserUnderProject;
  }

  @action setAllUserUnderProject(allUserUnderProject){
    this.allUserUnderProject = allUserUnderProject;
  }

  @action loadData(projectId){
    this.getAllUserUnderProjectFromWebServer(projectId,PublicAuthKit.getItem('username')).then(response=>{
      if(response){
        this.allUserUnderProject = response.data;
      }else{
        message.error('网络错误，请稍后再试！');
      }
    });
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
};

const projectStore = new ProjectStore();
export default projectStore;
