/**
 * Created by Jerry on 16/4/25.
 */
import React, {
    StyleSheet,
    Text,ScrollView,ListView,Alert,
    View,Image,Component,ActionSheetIOS,Linking,
    Dimensions,TouchableHighlight,TouchableOpacity
} from 'react-native';


import styles from '../common/styles';
import { Form, InputField,
    Separator, SwitchField, LinkField ,
    PickerField, DatePickerField
} from '../common/forms';
import storage from '../common/storage';
import Login from '../common/login'
import Service from '../common/Service';
import MyInfo from '../common/myInfo';
import Setting from './setting';
import DatasLib from './datasLib';

export default class myCenter extends Component{
    constructor(props){
        super(props);
        this.state={
            userData:{},
            navigatorFa:this.props.navigator
        };
    }
    componentWillMount(){
        this.getUserInfo();
    }
    componentWillReceiveProps(){
        this.getUserInfo();
    }
    getStorageData(){
        var _this = this;
        storage.load({
            key: 'user',
        }).then( ret => {
            if(ret){
                _this.setState({
                    userData:ret
                })
            }
           // console.log(ret);
        }).catch(err => {
            // 如果没有找到数据且没有同步方法，
            console.warn(err);
        })
    }
    getUserInfo(){
        var _this = this;
        storage.load({
            key: 'userToken',
        }).then( ret => {
            //如果找到数据，则在then方法中返回
            //console.log(ret);
            if(!ret){
                Alert.alert(
                    '提示',
                    '登录信息失效,请重新登录',
                    [
                        {
                            text: 'OK',
                            onPress: () =>
                                //跳转到新View
                                _this.props.navigator.replace({
                                    name:'Login',
                                    component:Login
                                })
                        }
                    ]
                );
                return false;
            }

            var postUrl = Service.host + Service.loginByToken;
            fetch(postUrl,{
                method:'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    token: ret
                })
            }).then((response)=>{
                //console.log(response);
                return response.json();
            }).then((responseText)=> {
                //获取到用户数据
                // console.log(responseText);
                var userData = responseText.datas[0];
                //console.log(userData);
                if(userData=='NO'){
                    Alert.alert(
                        '提示',
                        '登录信息失效,请重新登录',
                        [
                            {
                                text: 'OK',
                                onPress: () =>
                                    _this.props.navigator.replace({
                                        name:'Login',
                                        component:Login
                                    })
                            }
                        ]
                    );
                    return false;
                }
                //缓存本地
                storage.save({
                    key: 'user',
                    rawData: userData
                });
                //console.log(userData);
                _this.setState({
                    userData:userData
                })

            }).catch(function (error) {
                console.log('验证失败', error);
                Alert.alert(
                    '提示',
                    '登录信息失效,请重新登录',
                    [
                        {
                            text: 'OK',
                            onPress: () =>
                                _this.props.navigator.replace({
                                    name:'Login',
                                    component:Login
                                })
                        }
                    ]
                );
            });

        }).catch( err => {
            //如果没有找到数据且没有同步方法，
            //或者有其他异常，则在catch中返回
            _this.props.navigator.replace({
                name:'Login',
                component:Login
            })
        });
    }
    moreInfo(obj){
       // console.log(obj);
        this.props.navigator.push({
            name:'MyInfo',
            component:MyInfo,
            params:{
                data:obj
            }
        })
    }
    myCenterQuit(){
        var navigatorPro = this.state.navigatorFa;
        var Buttons = [
            '退出',
            '取消'
        ];
        var events = [];

        events.push(function () {
            storage.remove({
                key: 'user'
            });
            storage.remove({
                key: 'userToken'
            });
            navigatorPro.replace({
                name:'Login',
                component:Login
            })
        });

        ActionSheetIOS.showActionSheetWithOptions({
            title:'确定退出？',
            options:Buttons,
            destructiveButtonIndex:Buttons.length - 2,
            cancelButtonIndex:Buttons.length - 1
        },function (index) {
            events[index]&&events[index]()
        });

    }
    showSetting(obj){
        var navigatorPro = this.state.navigatorFa;
        navigatorPro.push({
            name:'Setting',
            component:Setting,
            params:{
                navigator:navigatorPro,
                userToken:obj.usertoken,
                userTel:obj.tel
            }
        })
    }
    render(){
        var Datas = this.state.userData;
        return(
            <View style={styles.marginTop25}>
                <View style={styles.myCenterHeader}>
                    <Image style={styles.myCenterImgbg} source={require("../img/bg_person.png")}>
                        <Image style={styles.myCenterAvatarImg}
                               source={{uri: Service.host + Datas.avatar}}
                        />
                        <Text style={styles.myCenterName}>{Datas.username}</Text>
                        <Text style={styles.myCenterPos}>{Datas.position}</Text>

                    </Image>
                </View>
                <View style={styles.myCenterMain}>
                    <View style={styles.myCenterStatusCon}>
                        <Text style={styles.myCenterStatus}>上班</Text>
                        <Text style={styles.myCenterStatus}>请假</Text>
                        <Text style={styles.myCenterStatus}>出差</Text>
                    </View>
                    <View style={styles.myCenterImgStatusCon}>
                        <Image style={styles.myCenterImgCon} source={require("../img/ic_workstatus.png")} />
                        <View  style={styles.myCenterImgStatusConIn}>

                            {
                                Datas.status =="上班" ?
                                    <Image style={[styles.myCenterImg,styles.myCenterImg1]} source={require("../img/btn_work.png")} />
                                :
                                Datas.status =="请假" ?
                                    <Image  style={styles.myCenterImg} source={require("../img/btn_leave.png")} />
                                :
                                    <Image style={[styles.myCenterImg,styles.myCenterImg2]}  source={require("../img/btn_business.png")} />
                            }

                        </View>
                    </View>
                </View>

                <View style={styles.linksGroup}>
                    <TouchableHighlight onPress={this.moreInfo.bind(this,Datas)}>
                        <View>
                            <LinkField label="个人信息" iconRight={<Image source={require("../img/ic_more.png")} />} />
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={this.showSetting.bind(this,Datas)}>
                        <View>
                            <LinkField label="设置" iconRight={<Image source={require("../img/ic_more.png")} />} />
                        </View>
                    </TouchableHighlight>

                </View>
                <View style={styles.linksGroup}>
                    <TouchableHighlight onPress={this.myCenterQuit.bind(this)}>
                        <View style={styles.myCenterQuit}>
                            <Text style={styles.myCenterQuitText}>退出</Text>
                        </View>
                    </TouchableHighlight>

                </View>


            </View>
        )
    }
}

                                                                                                                