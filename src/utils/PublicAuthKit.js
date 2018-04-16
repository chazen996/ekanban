import axios from 'axios';
import Config from "./Config";
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

    axios.defaults.baseURL = Config.baseURL;
    axios.defaults.headers['Content-Type'] = Config.ContentType;
  }

  /* 利用随机数和时间戳生成一个不会重复的ID,并将其入队 */
  generateNoneDuplicateID(randomLength) {
    return Number(
      Math.random().toString().substr(
        3, randomLength) + Date.now()).toString(36);
  }

  /* 深度拷贝函数 */
  deepCopy(obj) {
    if (obj instanceof Array) {
      const array = [];
      for (let i = 0; i < obj.length; i += 1) {
        array[i] = this.deepCopy(obj[i]);
      }
      return array;
    } else if (obj instanceof Object) {
      const newObj = {};
      Object.keys(obj).forEach((field) => {
        newObj[field] = this.deepCopy(obj[field]);
      });
      return newObj;
    } else {
      return obj;
    }
  }

  /* 删除两端的空格 */
  trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
  }

  // 获取某元素以浏览器左上角为原点的坐标
  getTopAndLeft(obj, result) {
    let objTemp = obj;
    const resultTemp = result;
    let t = objTemp.offsetTop; // 获取该元素对应父容器的上边距
    let l = objTemp.offsetLeft; // 对应父容器的上边距
    // 判断是否有父容器，如果存在则累加其边距
    objTemp = objTemp.offsetParent;
    while (objTemp != null) {
      t += objTemp.offsetTop; // 叠加父容器的上边距
      l += objTemp.offsetLeft; // 叠加父容器的左边距
      objTemp = objTemp.offsetParent;
    }
    resultTemp.top = t;
    resultTemp.left = l;
  }

  /* 清除页面上所有选中的元素（解决按住文字无法拖动鼠标） */
  clearSelections=() => {
    if (window.getSelection) {
      // 获取选中
      const selection = window.getSelection();
      // 清除选中
      selection.removeAllRanges();
    } else if (document.selection && document.selection.empty) {
      // 兼容 IE8 以下，但 IE9+ 以上同样可用
      document.selection.empty();
    }
  };
  // saveCardPosition=(cardPosition)=>{
  //   sessionStorage.setItem('cardPosition',JSON.stringify(cardPosition));
  // };
  // getCardPosition=()=>{
  //   let temp = JSON.parse(sessionStorage.getItem('cardPosition'));
  //   return temp;
  // };
}
const publicAuthKit = new PublicAuthKit();
export default publicAuthKit;
