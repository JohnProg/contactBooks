/**
 * Created by Jerry on 16/9/5.
 */
import React, {
    StyleSheet,
    Text,ScrollView,ListView,Alert,
    View,Image,Component,ActionSheetIOS,Linking,
    Dimensions,TouchableHighlight,TouchableOpacity,TextInput
} from 'react-native';


import styles from '../common/styles';
import Service from '../common/Service';
import storage from '../common/storage';



const getPhoneBooks = (callback,errCallback) =>{
       const postUrl = Service.host + Service.getPhoneBooksPos;
       //console.log(postUrl);
       fetch(postUrl,{
           method:'post'
       }).then((response)=>{
           //console.log(response)
           return response.json();
       }).then((responseText)=>{
           //return responseText;
           callback(responseText.datas);
           saveBooksList(responseText.datas);

       }).catch((error)=>{
           console.log(error);
           if(error){
               /*Alert.alert(
                   '提示',
                   '当前网络不可用，加载缓存数据！'
               );*/
               getStroageBooksList((ret)=>{
                   callback(ret);
               },errCallback);
           }

       }).done() ;

};
//通过ID加载信息
const getPhoneBooksById = (id,_callback,errCallback)=>{
        //先从网络获取
        const postUrl = Service.host + Service.loadStuffById;
        fetch(postUrl,{
            method:'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                id: id
            })
        }).then((response)=>{
            //console.log(response)
            return response.json();
        }).then((responseText)=>{

            _callback(responseText.datas.userbookList[0]);
        }).catch((error)=>{
            //出错后加载缓存
            console.log(error);
            //通过ID获取缓存用户信息
            getStroageUserInfo(id,(data)=>{
                _callback(data);
            },errCallback);

        }).done();
    //getStroageUserInfo(id)
};

//通过token加载信息
const getUserInfoByToken = (token,_callback)=>{
    //先从网络获取
    const postUrl = Service.host + Service.getPhoneBooks;
    //console.log(postUrl);
    fetch(postUrl,{
        method:'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            token: token
        })
    }).then((response)=>{
        return response.json();
    }).then((responseText)=>{
        _callback(responseText);
    }).catch((error)=>{
        //出错后加载缓存
        console.log(error)
    }).done()



};

//获取缓存通讯录列表
const getStroageBooksList = (_callback,errCallback)=>{
    storage.load({
        key: 'booksList',
    }).then( ret => {
        console.log(ret);
        _callback(ret);
    }).catch(err => {
        //如果没有找到数据且没有同步方法，
        //或者有其他异常，则在catch中返回
        console.warn(err.message);
        if(err){
            //仍然出错就提示错误信息
            errCallback()
        }
    })
};

//加载缓存用户信息
const getStroageUserInfo = (id,_callback,errCallback)=>{
    storage.load({
        key: 'booksList',
    }).then( ret => {
        var datasArr = ret.series;
        var newObj ;
        for(var i=0;i<datasArr.length;i++){
            var childArr = datasArr[i].series;
            for(var j=0;j<childArr.length;j++){
                if(childArr[j].id == id){
                    newObj=childArr[j];
                    break;
                }
            }
        }
        _callback(newObj);
    }).catch(err => {
        //如果没有找到数据且没有同步方法，
        //或者有其他异常，则在catch中返回
        console.warn(err.message);
        if(err){
            errCallback()
        }
    })
};

//保存通讯录到缓存
const saveBooksList = (data,_callback)=>{
    storage.save({
        key:'booksList',
        rawData:data
    })
};

//获取缓存通讯录信息
const getBooksList = (_callback)=>{

};

//保存用户信息
const saveUserInfo = (data,_callback)=>{
    storage.save({
        key:'user',
        rawData:data
    })
};

//获取用户信息
const getUserInfo = (_callback)=>{

};

export default {
    getPhoneBooks,
    getPhoneBooksById,
    getUserInfoByToken,
    getStroageBooksList,
    getStroageUserInfo,
    saveBooksList,
    getBooksList,
    saveUserInfo,
    getUserInfo
}
