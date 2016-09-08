/**
 * Created by Jerry on 16/4/18.
 */
var Service = {
  //host:'http://218.90.150.118:3003/',
  host:'http://192.168.40.137:3001/',
  //host:'http://10.211.55.6:3001/',
  //host:'http://nodejs-xxx.bjdv:3001/',
  getPhoneBooks: 'phoneBooks/loadStuff',
  getPhoneBooksPos: 'phoneBooks/loadStuffWithPos',
    loadStuffById: 'phoneBooks/loadStuffById',
    loadStuffByToken: 'phoneBooks/loadStuffByToken',
  login:'login/',
  loginByToken:'login/loginByToken/',
  getNews:'news/loadNews',
  changePwd:'users/changePwd',
  searhBooks: 'phoneBooks/searhBooks',
  uploadAvatar:'phoneBooks/uploadAvatar',
    modSex:'phoneBooks/modSex',
    modIntro:'phoneBooks/modIntro',
    modStatus:'phoneBooks/modStatus'
};
module.exports = Service;