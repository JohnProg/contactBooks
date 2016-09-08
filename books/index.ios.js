/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,ScrollView,ListView,
  View,Image,Alert,
    TouchableOpacity,NavigatorIOS,Navigator,ActivityIndicatorIOS
} from 'react-native';

import MainTab from './common/mainTab'
import Login from './common/login'
import storage from './common/storage';
import styles from './common/styles';
import Service from './common/Service';
import DatasLib from './common/datasLib';

class booksindex extends Component{
    constructor(props){
        super(props);
        this.state={
            logined:false,
            isLoading:true,
            booksList:null
        }
    }
    componentWillMount(){
        var _this = this;
        storage.load({
            key: 'user',
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
                                _this.setState({
                                    logined:false,
                                    isLoading:false
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
                    token: ret.usertoken
                })
            }).then((response)=>{
                //console.log(response);
                return response.json();
            }).then((responseText)=> {
                var userData = responseText.datas[0];
                if(userData=='NO'){
                    Alert.alert(
                        '提示',
                        '登录信息失效,请重新登录',
                        [
                            {
                                text: 'OK',
                                onPress: () =>
                                    _this.setState({
                                        logined:false,
                                        isLoading:false
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

                DatasLib.getPhoneBooks((data)=>{
                    _this.setState({
                        logined:true,
                        isLoading:false,
                        booksList:data
                    });
                },()=>{
                    Alert.alert(
                        '提示',
                        '登录信息失效,请重新登录',
                        [
                            {
                                text: 'OK',
                                onPress: () =>
                                    _this.setState({
                                        logined:false,
                                        isLoading:false,
                                        booksList:null
                                    })
                            }
                        ]
                    );
                });


            }).catch(function (error) {
                console.log('验证失败', error);
                Alert.alert(
                    '提示',
                    '登录信息失效,请重新登录',
                    [
                        {
                            text: 'OK',
                            onPress: () =>
                                _this.setState({
                                    logined:false,
                                    isLoading:false
                                })
                        }
                    ]
                );
            });

        }).catch( err => {
            //如果没有找到数据且没有同步方法，
            //或者有其他异常，则在catch中返回
            _this.setState({
                logined:false,
                isLoading:false
            });
        });
    }
    render(){

        if(this.state.isLoading ){
            return(
                <View style={styles.loadingView}>
                    <ActivityIndicatorIOS size="large" color="#333"></ActivityIndicatorIOS>
                    <View style={styles.loadingViewMainTextCon}>
                        <Text style={styles.loadingViewMainText}>玩命加载中...</Text>
                    </View>
                </View>
            )
        }else{
            return(
                this.state.logined ?
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
                                return <Component {...route.params} navigator={navigator} datas={this.state.booksList} />
                            }
                        }}
                        sceneStyle={{backgroundColor:"#F2F5FA"}}
                    />
                    :
                    <Navigator
                        initialRoute={{
                            component:Login,
                            name:'Login'
                        }}
                        configureScene={()=>{
                            return Navigator.SceneConfigs.FloatFromRight;
                        }}
                        renderScene={(route,navigator)=>{
                            let Component = route.component;
                            if (route.component){
                                return <Component {...route.params} navigator={navigator} />
                            }
                        }}
                        sceneStyle={{backgroundColor:"#F2F5FA"}}
                    />

            )
        }


    }
}



AppRegistry.registerComponent('books', () => booksindex);
