import { observable,action,computed} from 'mobx';

class HomeStore {
  @observable showChangePasswordModal = false;
  @computed get getShowChangePasswordModal(){
    return this.showChangePasswordModal;
  }
  @action setShowChangePasswordModal(status){
    this.showChangePasswordModal = status;
  }
}

const homeStore = new HomeStore();
export default homeStore;
