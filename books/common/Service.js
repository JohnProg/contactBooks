/**
 * Created by Jerry on 16/4/18.
 */
var Service = {
  
  host:'http://yourhostname/',
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
