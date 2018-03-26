import axios from 'axios';
/* 使用AES对称加密算法：对数据进行加密解密操作 */
const crypto = require('crypto');

function aesEncrypt(data, key) {
  const cipher = crypto.createCipher('aes192', key);
  var crypted = cipher.update(data, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

function aesDecrypt(encrypted, key) {
  const decipher = crypto.createDecipher('aes192', key);
  var decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

class PublicAuthKit{

  /* 往sessionStorage中储存加密后的数据 */
  setItem(key,value){
    sessionStorage.setItem(key,aesEncrypt(value,`${key}:secret`));
  }

  /* 从sessionStorage中获取信息 */
  getItem(key){
    let value = sessionStorage.getItem(key);
    if(value == null){
      return null;
    }
    return aesDecrypt(value,`${key}:secret`);
  }

  setItemIntoLocalStorage(key,value){
    localStorage.setItem(key,aesEncrypt(value,`${key}:secret`));
  }

  getItemFromLocalStorage(key){
    let value = localStorage.getItem(key);
    if(value == null){
      return null;
    }
    return aesDecrypt(value,`${key}:secret`);
  }

  removeItem(key){
    sessionStorage.removeItem(key);
  }

  removeItemFromLocalStorage(key){
    localStorage.removeItem(key);
  }

  /* 控制路由跳转前检查是否登陆，如未登陆直接跳转到login界面 */
  checkAuth() {
    let username = this.getItem('username');
    let loginStatus = this.getItem('loginStatus');
    /* 如果本地加密的登陆信息不存在或者登陆信息不合法，则返回false */
    if(loginStatus){
      let array = loginStatus.split(';');
      if(array[0]===username&&array[1]==='login'){
        return true;
      }
      return false;
    }
    return false;
  }

  /* 为auth设置token */
  addAuthHeader(){
    const token = this.getItem('token');
    axios.defaults.headers['Authorization'] = token;
  }

  /* 利用随机数和时间戳生成一个不会重复的ID,并将其入队 */
  generateNoneDuplicateID(randomLength) {
    return Number(
      Math.random().toString().substr(
        3, randomLength) + Date.now()).toString(36);
  }
}
const publicAuthKit = new PublicAuthKit();
export default publicAuthKit;
