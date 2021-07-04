// eslint-disable-next-line max-classes-per-file
import CryptoJS from 'crypto-js';

class Aes {
  /**
   * @word 要加密的内容
   * @keyWord String  服务器随机返回的关键字
   *  */
  encrypt(word: string, keyWord = 'XwKsGlMcdPMEhR1B') {
    const key = CryptoJS.enc.Utf8.parse(keyWord);
    const plain = CryptoJS.enc.Utf8.parse(word);
    const encrypted = CryptoJS.AES.encrypt(plain, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  }
}

/**
 * 密码加解密
 */
class Pwd {}

export const aes = new Aes();
export const pwd = new Pwd();
