/**
 * Created by Jerry on 16/5/5.
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


import styles from '../common/styles';
import storage from '../common/storage';
import Service from '../common/Service';
import MainTab from '../common/mainTab'


export default class login extends Component{
    constructor(props){
        super(props);
        //var faprops = this.props;
        //console.log(props);

        this.state={
            isLoading:false
        }
    }
    login(){
        if (this.state.phone && this.state.password ){
            //显示loading
            this.setState({
                isLoading:true
            });
            //设置请求地址
           // const postUrl = Service.host + Service.login + '?phone='+this.state.phone+'&pwd='+this.state.password;
            const postUrl = Service.host + Service.login;
            var _this = this;
            //console.log(postUrl);
            //获取登陆数据
            fetch(postUrl,{
                method:'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                timeout:10000,
                body:JSON.stringify({
                    phone: this.state.phone,
                    pwd: this.state.password,
                })
            }).then((response)=>{
                //console.log(response);
                return response.json();
            }).then((responseText)=>{
                //console.log(responseText);

                if(responseText.status=="PSWNO"){
                    Alert.alert(
                        '提示',
                        '账户或者密码错误，请重试！',
                        [
                            {
                                text: 'OK',
                                onPress: () =>
                                    //跳转到新View
                                    _this.setState({
                                        isLoading:false
                                    })
                            }
                        ]
                    );
                    return false;
                }
                //获取到用户数据
                var userData = responseText.data[0];

                //设置用户数据
                _this.setState({
                    userData:userData,
                    isLoading:false
                });
                //缓存本地
                storage.save({
                    key: 'user',
                    rawData: userData
                });
                storage.save({
                    key: 'userToken',
                    rawData: userData.usertoken
                });
                //跳转到新View
                _this.props.navigator.replace({
                    name:'Logined',
                    component:LoginedIndex,
                    params:{
                        data:userData
                    }
                });

            }).catch((error)=>{
                console.log(error);
                Alert.alert(
                    '提示',
                    '登录失败，请重试！',
                    [
                        {
                            text: 'OK',
                            onPress: () =>
                                //跳转到新View
                                _this.setState({
                                    isLoading:false
                                })
                        }
                    ]
                );
            }).done();
        }else {
            var _this = this;
            Alert.alert(
                '提示',
                '账户或者密码不能为空，请重试！',
                [
                    {
                        text: 'OK',
                        onPress: () =>
                            //跳转到新View
                            _this.setState({
                                isLoading:false
                            })
                    }
                ]
            );
        }


    }
    render(){
        return(
            <View style={styles.loginCon}>
                <View style={styles.loginAvatar}>
                    <Image style={styles.loginAvatarImg} source={require('../img/ic_login.png')} />
                </View>
                <View style={styles.loginCenter}>
                    <View style={styles.loginFormList}>
                        <Image style={styles.loginFormListImg} source={require('../img/ic_phone.png')}/>
                        <TextInput style={styles.loginFormInput}
                            placeholder='请输入手机号码'
                            keyboardType='numeric'
                            placeholderTextColor='#bdc3c9'
                            maxLength={11}
                           textAlignVertical ='center'
                           clearButtonMode="while-editing"
                           onChangeText={(text)=>this.setState({phone:text})}
                        />
                    </View>
                    <View style={[styles.loginFormList,styles.marginTop10]}>
                        <Image style={styles.loginFormListImg} source={require('../img/ic_lock.png')}/>
                        <TextInput style={styles.loginFormInput}
                                   placeholder='请输入密码'
                                   placeholderTextColor='#bdc3c9'
                                   secureTextEntry={true}
                                   textAlignVertical ='center'
                                   maxLength={16}
                                   clearButtonMode="while-editing"
                                   keyboardAppearance="dark"
                                   onChangeText={(text)=>this.setState({password:text})}
                        />
                    </View>
                    <View style={styles.loginFormTxt}>
                        <Text style={styles.loginFormTxtIn}>使用验证码登陆</Text>
                        <Text style={styles.loginFormTxtIn}>忘记密码?</Text>
                    </View>
                    <View style={styles.loginFormBtnCon}>
                        <TouchableOpacity activeOpacity={0.5} onPress={this.login.bind(this)}>
                            <View style={styles.loginFormBtn}>
                                <Text style={styles.loginFormBtnTxt}>登录</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>
                <View style={styles.loginBottom}>

                </View>
                {
                    this.state.isLoading ?
                        <View style={styles.loadingView}>
                            <ActivityIndicatorIOS size="large" color="#333"></ActivityIndicatorIOS>
                        </View>
                    :null
                }


            </View>
            )

    }
}

class LoginedIndex extends Component{
    constructor(props){
        super(props);
        //console.log(this.props.data);
    }
    render(){
        return(
            <Navigator
                initialRoute={{
                            component:MainTab,
                            name:'Home'
                        }}
                configureScene={()=>{
                            return Navigator.SceneConfigs.FloatFromRight;
                        }}
                renderScene={(route,navigator)=>{
                            let Component = route.component;
                            if (route.component){
                                //console.log(route);
                                return <Component {...route.params} navigator={navigator} />
                            }
                        }}
                sceneStyle={{backgroundColor:"#F2F5FA"}}
            />
        )
    }
}