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

class AuthSessionStorge{

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
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }

}
const authSessionStorge = new AuthSessionStorge();
export default authSessionStorge;
