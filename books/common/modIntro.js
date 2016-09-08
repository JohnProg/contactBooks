/**
 * Created by Jerry on 16/9/2.
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

export default class modIntro extends Component{
    constructor(props){
        super(props);
        this.state={
            intro:this.props.data,
            token:this.props.token
        }
    }
    backRoute(){
        this.props.navigator.pop()
    }
    saveIntro(){
        var _this = this;
        var postUrl = Service.host + Service.modIntro;
        var intro = _this.state.intro;
        fetch(postUrl,{
            method:'post',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                intro:intro,
                token:_this.state.token
            })
        }).then((response)=>{
            return response.json();
        }).then((responseText)=>{
            //console.log(responseText);
            if(responseText.status == "OK"){

                //console.log(sex);
                //修改本地存储
                storage.load({
                    key: 'user',
                }).then(ret => {
                    // 如果找到数据，则在then方法中返回
                    var newVal = ret;
                    newVal.bz = intro;

                    storage.save({
                        key: 'user',
                        rawData: newVal
                    }).then(()=>
                        _this.props.navigator.pop()
                    );

                }).catch(err => {
                    // 如果没有找到数据且没有同步方法，
                    console.warn(err);
                })

            }else{
                Alert.alert(
                    '提示',
                    '修改失败,请重试！'
                );

                return false;
            }


        }).catch(function (err) {
            console.log('验证失败', error);
            Alert.alert(
                '提示',
                '修改失败，请重试'
            )

        })


    }
    render(){
        return(
            <View style={{marginTop:25}}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.headerBtn} onPress={this.backRoute.bind(this)}>
                        <Image source={require("../img/btn_return.png")} />
                    </TouchableOpacity>
                    <Text style={styles.headerTxt}>自我介绍</Text>
                    <TouchableOpacity style={styles.headerTxtBtn} onPress={this.saveIntro.bind(this)}>
                        <Text style={styles.headerTxtBtntxt}>
                            保存
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.introView}>
                    <TextInput
                        style={styles.introInput}
                        placeholder='请输入自我介绍'
                        placeholderTextColor='#bdc3c9'
                        multiline = {true}
                        onChangeText={(text)=>this.setState({intro:text})}
                        value={this.state.intro}
                    />
                </View>




            </View>
        )
    }

}