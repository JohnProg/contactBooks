/**
 * Created by Jerry on 16/8/12.
 */

import React, {
    StyleSheet,
    Text,ScrollView,ListView,
    View,Image,Component,ActionSheetIOS,Linking,Alert,
    Dimensions,TouchableHighlight,TouchableOpacity,ActivityIndicatorIOS
} from 'react-native';

import styles from '../common/styles';
import storage from '../common/storage';
import Service from '../common/Service';
import Util from './Util';
var Platform = require('react-native').Platform;
var ImagePicker = require('react-native-image-picker');

var options = {
    title: '选择一张图片作为头像',
    takePhotoButtonTitle:'相机...',
    chooseFromLibraryButtonTitle:'从相册选择...',
    cancelButtonTitle:'取消',
    storageOptions: {
        skipBackup: true,
        path: 'avatar'
    },
    allowsEditing:true
};


export default class Aavatar extends Component{
    constructor(props){
        super(props);
        this.state ={
            datas:this.props.data,
            avatar:this.props.data.avatar,
            loading:true
        }
    }
    backRoute(){
        this.props.navigator.pop()
    }
    choseImg(){
        ImagePicker.showImagePicker(options, (response) => {
           // console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else {
                // You can display the image using either data...
                const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

                // or a reference to the platform specific asset location
                if (Platform.OS === 'ios') {
                    const source = {uri: response.uri.replace('file://', ''), isStatic: true};
                } else {
                    const source = {uri: response.uri, isStatic: true};
                }
               // console.log(source);

                this.upLoadImg(source);
            }
        });

    }
    upLoadImg(data){
        var _this = this;
        this.setState({
            loading: false
        });
        //console.log(this.state.datas);
        const formData = new FormData();
        formData.append('file',{uri:data,name:'avatar',type:'image/jpeg'});
        formData.append('token',this.state.datas.usertoken);
        //var dataImg = data.uri.replace("data:image/jpeg;base64,","");
        //console.log(data);
        const postUrl = Service.host + Service.uploadAvatar ;

        fetch(postUrl,{
            method:'post',
            'Content-Type':'multipart/form-data',
            body:formData
        }).then((response)=>{
            //console.log(response);
            return response.json();
        }).then((responseText)=> {

            if(responseText.status=="OK"){
                _this.setState({
                    avatar: responseText.imgPath,
                    loading: true
                });

                //修改本地存储
                storage.load({
                    key: 'user',
                }).then(ret => {
                    // 如果找到数据，则在then方法中返回
                    var newVal = ret;
                    newVal.avatar = _this.state.avatar;
                    storage.save({
                        key: 'user',
                        rawData: newVal
                    });
                }).catch(err => {
                    // 如果没有找到数据且没有同步方法，
                    console.warn(err);
                })

            }else{
                Alert.alert(
                    '提示',
                    '上传失败,请重试！',
                    [
                        {
                            text: 'OK',
                            onPress: () =>
                                //跳转到新View
                                _this.setState({
                                    loading: true
                                })
                        }
                    ]
                );

                return false;
            }


        })
    }
    render(){
        //var Datas = this.state.datas;
        return(
            <View style={{marginTop:25}}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.headerBtn} onPress={this.backRoute.bind(this)}>
                        <Image source={require("../img/btn_return.png")} />
                    </TouchableOpacity>
                    <Text style={styles.headerTxt}>修改头像</Text>
                    <TouchableOpacity style={styles.headerBtn} onPress={this.choseImg.bind(this)}>
                        <Image source={require("../img/btn_more.png")} />
                    </TouchableOpacity>
                </View>
                <View style={styles.avatarImgCon}>

                    <Image
                        source={{uri: Service.host + this.state.avatar}}
                        resizeMode={Image.resizeMode.contain}
                        width={Util.size.width}
                        height={Util.size.height-65}
                    />
                </View>

                {
                    !this.state.loading ?
                        <View style={styles.loadingView}>
                            <ActivityIndicatorIOS size="large" color="#000"></ActivityIndicatorIOS>
                        </View>
                        :null
                }

            </View>
        )
    }
}

