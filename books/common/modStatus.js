/**
 * Created by Jerry on 16/8/31.
 */
import React, {
    StyleSheet,
    Text,ScrollView,ListView,Alert,
    View,Image,Component,ActionSheetIOS,Linking,
    Dimensions,TouchableHighlight,TouchableOpacity
} from 'react-native';


import styles from '../common/styles';
import Service from '../common/Service';
import storage from '../common/storage';

export default class modSex extends Component{
    constructor(props){
        super(props);

        this.state ={
            datas:this.props.data,
            token:this.props.token,
            shangban:true,
            qingjia:false,
            chuchai:false,
        }
    }
    backRoute(){
        this.props.navigator.pop()
    }
    componentWillMount(){
        var sexVal = this.state.datas;

        if(sexVal=="上班"){
            this.setState({
                shangban:true,
                qingjia:false,
                chuchai:false,
            })
        }else if(sexVal=="请假"){
            this.setState({
                shangban:false,
                qingjia:true,
                chuchai:false,
            })
        }else{
            this.setState({
                shangban:false,
                qingjia:false,
                chuchai:true,
            })
        }
    }
    shangbanSelected(){
        this.modStautsFuc("上班");
    }
    qingjiaSelected(){
        this.modStautsFuc("请假");
    }
    chuchaiSelected(){
        this.modStautsFuc("出差");
    }
    modStautsFuc(status){
        var _this = this;
        var postUrl = Service.host + Service.modStatus;
        //return false;
        fetch(postUrl,{
            method:'post',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                status:status,
                token:_this.state.token
            })
        }).then((response)=>{
            return response.json();
        }).then((responseText)=>{
            //console.log(responseText);
            if(responseText.status == "OK"){
                //更改界面状态
                if(responseText.statusText=="上班"){
                    this.setState({
                        shangban:true,
                        qingjia:false,
                        chuchai:false,
                    })
                }else if(responseText.statusText=="请假"){
                    this.setState({
                        shangban:false,
                        qingjia:true,
                        chuchai:false,
                    })
                }else{
                    this.setState({
                        shangban:false,
                        qingjia:false,
                        chuchai:true,
                    })
                }
                //console.log(sex);
                //修改本地存储
                storage.load({
                    key: 'user',
                }).then(ret => {
                    // 如果找到数据，则在then方法中返回
                    var newVal = ret;
                    newVal.status = responseText.statusText;
                    //console.log(newVal);

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
            console.log('验证失败', err);
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
                    <Text style={styles.headerTxt}>修改状态</Text>
                    <TouchableOpacity style={styles.headerTxtBtn} >

                    </TouchableOpacity>
                </View>

                <View>
                    {
                        this.state.shangban ?
                            <TouchableOpacity onPress={this.shangbanSelected.bind(this)}>
                                <View style={[styles.linksLists,styles.backgroundFFF]}>
                                    <View style={styles.linksListsLeft}>
                                        <Text style={styles.linksLabelLeft}>上班</Text>
                                    </View>
                                    <View style={styles.linksListsRightIcon}>
                                        <Image source={require("../img/gou.png")}/>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity  onPress={this.shangbanSelected.bind(this)}>
                                <View style={[styles.linksLists,styles.backgroundFFF]}>
                                    <View style={styles.linksListsLeft}>
                                        <Text style={styles.linksLabelLeft}>上班</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                    }
                    {
                        this.state.qingjia ?
                            <TouchableOpacity  onPress={this.qingjiaSelected.bind(this)}>
                                <View style={[styles.linksLists,styles.backgroundFFF]}>
                                    <View style={styles.linksListsLeft}>
                                        <Text style={styles.linksLabelLeft}>请假</Text>
                                    </View>
                                    <View style={styles.linksListsRightIcon}>
                                        <Image source={require("../img/gou.png")}/>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity  onPress={this.qingjiaSelected.bind(this)}>
                                <View style={[styles.linksLists,styles.backgroundFFF]}>
                                    <View style={styles.linksListsLeft}>
                                        <Text style={styles.linksLabelLeft}>请假</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                    }
                    {
                        this.state.chuchai ?
                            <TouchableOpacity  onPress={this.chuchaiSelected.bind(this)}>
                                <View style={[styles.linksLists,styles.backgroundFFF]}>
                                    <View style={styles.linksListsLeft}>
                                        <Text style={styles.linksLabelLeft}>出差</Text>
                                    </View>
                                    <View style={styles.linksListsRightIcon}>
                                        <Image source={require("../img/gou.png")}/>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity  onPress={this.chuchaiSelected.bind(this)}>
                                <View style={[styles.linksLists,styles.backgroundFFF]}>
                                    <View style={styles.linksListsLeft}>
                                        <Text style={styles.linksLabelLeft}>出差</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                    }
                </View>

            </View>
        )
    }

}

