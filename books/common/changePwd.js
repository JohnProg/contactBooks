/**
 * Created by Jerry on 16/7/28.
 */
import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Text,ScrollView,ListView,
    View,Image,TextInput,
    TouchableOpacity,NavigatorIOS,Navigator,Alert,
    ActivityIndicatorIOS
} from 'react-native';

import Login from '../common/login'
import styles from '../common/styles';
import storage from '../common/storage';
import Service from '../common/Service';

export default class changePwd extends Component{
    constructor(props){
        super(props);
        this.state={
            oldpwd:"",
            password:"",
            password2:"",
            loading:true
        }
    }
    changePwdFuc(){
        var _this = this;
        var userToken = this.props.userToken;
        var oldPwd = this.state.oldpwd;
        var newPassword = this.state.password;
        var newPassword2 = this.state.password2;
        var userTel = this.props.userTel;

        if(oldPwd==""){
            Alert.alert(
                '提示',
                '原始密码不能为空！'
            );
            return false;
        }else if(oldPwd.length<6){
            Alert.alert(
                '提示',
                '原始密码应该为6位以上！'
            );
            return false;
        }
        if(newPassword==""){
            Alert.alert(
                '提示',
                '新密码不能为空！'
            );
            return false;
        }else if(newPassword.length<6){
            Alert.alert(
                '提示',
                '新密码应该为6位以上！'
            );
            return false;
        }
        if(newPassword2==""){
            Alert.alert(
                '提示',
                '请再次输入新密码！'
            );
            return false;
        }else if(newPassword2.length<6){
            Alert.alert(
                '提示',
                '新密码应该为6位以上！'
            );
            return false;
        }
        if(newPassword != newPassword2){
            Alert.alert(
                '提示',
                '两次密码必须相同！'
            );
            return false;
        }
        if(oldPwd == newPassword){
            Alert.alert(
                '提示',
                '新密码应该不同于原始密码！'
            );
            return false;
        }

        this.setState({
            loading:false
        });

        var postUrl = Service.host + Service.changePwd;

        //console.log(postUrl);

        fetch(postUrl,{
            method:'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            timeout:10000,
            body:JSON.stringify({
                userToken: userToken,
                oldPwd:oldPwd,
                newPwd:newPassword,
                tel:userTel
            })
        }).then((response)=>{
            //console.log(response);
            return response.json();
        }).then((responseText)=> {
            //获取到用户数据
            //console.log(userData);
            if (responseText.status == 'NO') {
                Alert.alert(
                    '提示',
                    '原始密码错误！',
                    [
                        {
                            text: 'OK',
                            onPress: () =>
                                //跳转到新View
                                _this.setState({
                                    loading:true
                                })
                        }
                    ]
                );
                return false;
            }else if(responseText.status == 'OK'){
                storage.remove({
                    key: 'user'
                });
                _this.props.navigator.replace({
                    name:'Login',
                    component:Login
                });

                Alert.alert(
                    '提示',
                    '修改密码成功，请重新登录！',
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
            }
        }).catch(function (error) {
            console.log(error);
            Alert.alert(
                '提示',
                '网络错误！',
                [
                    {
                        text: 'OK',
                        onPress: () =>
                            //跳转到新View
                            _this.setState({
                                loading:true
                            })
                    }
                ]
            );
        });

       // console.log(userToken);
    }
    backRoute(){
        this.props.navigator.pop()
    }

    render(){

        return(
            <View  style={{marginTop:25}}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.headerBtn} onPress={this.backRoute.bind(this)}>
                        <Image source={require("../img/btn_return.png")} />
                    </TouchableOpacity>
                    <Text style={styles.headerTxt}>修改密码</Text>
                    <TouchableOpacity style={styles.headerBtn} >

                    </TouchableOpacity>
                </View>
                <View style={styles.loginCenter}>

                    <View style={[styles.loginFormList,styles.marginTop10]}>
                        <Image style={styles.loginFormListImg} source={require('../img/ic_lock.png')}/>
                        <TextInput style={styles.loginFormInput}
                                   placeholder='请输入原始密码'
                                   placeholderTextColor='#bdc3c9'
                                   secureTextEntry={true}
                                   textAlignVertical ='center'
                                   maxLength={16}
                                   clearButtonMode="while-editing"
                                   keyboardAppearance="dark"
                                   onChangeText={(text)=>this.setState({oldpwd:text})}
                        />
                    </View>
                    <View style={[styles.loginFormList,styles.marginTop10]}>
                        <Image style={styles.loginFormListImg} source={require('../img/ic_lock.png')}/>
                        <TextInput style={styles.loginFormInput}
                                   placeholder='请输入新密码'
                                   placeholderTextColor='#bdc3c9'
                                   secureTextEntry={true}
                                   textAlignVertical ='center'
                                   maxLength={16}
                                   clearButtonMode="while-editing"
                                   keyboardAppearance="dark"
                                   onChangeText={(text)=>this.setState({password:text})}
                        />
                    </View>
                    <View style={[styles.loginFormList,styles.marginTop10]}>
                        <Image style={styles.loginFormListImg} source={require('../img/ic_lock.png')}/>
                        <TextInput style={styles.loginFormInput}
                                   placeholder='请再次输入新密码'
                                   placeholderTextColor='#bdc3c9'
                                   secureTextEntry={true}
                                   textAlignVertical ='center'
                                   maxLength={16}
                                   clearButtonMode="while-editing"
                                   keyboardAppearance="dark"
                                   onChangeText={(text)=>this.setState({password2:text})}
                        />
                    </View>

                    <View style={styles.loginFormBtnCon}>
                        <TouchableOpacity activeOpacity={0.5} onPress={this.changePwdFuc.bind(this)}>
                            <View style={styles.loginFormBtn}>
                                <Text style={styles.loginFormBtnTxt}>确定修改</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>

                {
                    !this.state.loading ?
                        <View style={styles.loadingView}>
                            <ActivityIndicatorIOS size="large" color="#333"></ActivityIndicatorIOS>
                        </View>
                        :null
                }

            </View>



        )
    }
}