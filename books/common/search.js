/**
 * Created by Jerry on 16/4/28.
 */
import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Text,ScrollView,ListView,
    View,Image,
    TouchableOpacity,
    Platform,
    PropTypes,TextInput,
    ActivityIndicatorIOS,Alert,Linking,ActionSheetIOS,TouchableHighlight
} from 'react-native';
import styles from './styles';
import Service from './Service';
import Util from './Util'
import StuffDetail from './stuffDetail';

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class Search extends Component{
    constructor(props){
        super(props);
        var navigatorPro = this.props.routeObj;
        this.state = {
            dataSource: ds.cloneWithRows([]),
            navigatorPro:navigatorPro
        };
        this.bindMethods();
    }
    bindMethods() {
        if (! this.bindableMethods) {
            return;
        }

        for (var methodName in this.bindableMethods) {
            this[methodName] = this.bindableMethods[methodName].bind(this);
        }
    }
    backRoute(){
        this.props.navigator.pop()
    }
    updateText(text){
        //console.log(text)
        const searchUrl = Service.host + Service.searhBooks;
        var _this = this;
        fetch(searchUrl,{
            method:'post',
            timeOut:10000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                keywords:text
            })
        }).then((response)=>{
            return response.json()
        }).then((responseText)=>{
            //console.log(responseText);
            if(responseText.length<=0){
                Alert.alert(
                    '提示',
                    '查无此人，请重试！',
                    [
                        {
                            text: 'OK',
                            onPress: () =>
                                //搜索框获得焦点
                                _this._input.focus()
                        }
                    ]
                );
                return false;
            }else{
                _this.setState({
                    dataSource: ds.cloneWithRows(responseText)
                })
            }
        })


    }
    render(){
        //console.log(this.props.data)
        return(
            <View style={{marginTop:25}}>
                <View style={styles.searchHeader}>
                    <TouchableOpacity style={styles.headerBtn} onPress={this.backRoute.bind(this)}>
                        <Image source={require("../img/btn_return.png")} />
                    </TouchableOpacity>
                    <View style={styles.searchInput}>
                        <TextInput style={styles.searchFormInput}
                                   placeholder='请输入搜索关键字'
                                   keyboardType='default'
                                   placeholderTextColor='#bdc3c9'
                                   returnKeyType="search"
                                   textAlignVertical ='center'
                                   clearButtonMode="while-editing"
                                   onSubmitEditing={(event) => this.updateText(event.nativeEvent.text)}
                                   ref={(c) => this._input = c}
                        />
                    </View>
                </View>

                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                    height={Util.size.height-65}
                    initialListSize={12}
                    enableEmptySections={true}
                />
            </View>
        )
    }

}


Object.assign(Search.prototype, {
    bindableMethods : {
        _renderRow : function (rowData, sectionID, rowID) {
            return (
                <TouchableHighlight  onPress={() => this._showActionSheet(rowData)}>
                    <View style={styles.stuffTextListCon}>
                        <View style={styles.stuffTextLeft}>
                            {
                                rowData.avatar ?
                                    <View style={styles.stuffTextImgCon}>
                                        <Image style={styles.stuffTextImg} source={{uri: Service.host + rowData.avatar}} />
                                    </View>
                                    :
                                    <View style={styles.stuffTextNoImgCon}>
                                        <Text style={styles.stuffTextNoImgTxt}>{(rowData.username).substr(0,1)}</Text>
                                    </View>
                            }

                            <View style={styles.stuffTexttxtCon}>
                                <View  style={styles.stuffTexttxtConTop}>
                                    <Text style={styles.stuffTextName}>{rowData.username}</Text>
                                    <Text style={styles.stuffTexpos}>{rowData.position}</Text>
                                </View>
                                <View style={styles.stuffTexttxtConBottom}>
                                    <Text style={styles.stuffTextPhone}>{rowData.tel}</Text>
                                </View>
                            </View>

                        </View>
                        <View style={styles.stuffStautsIconCon}>

                            {
                                rowData.status ?
                                    <View style={styles.stuffStautsTxtCon}>
                                        <Text style={styles.stuffStautsTxt}>{rowData.status}</Text>
                                    </View>
                                    :
                                    <View></View>
                            }
                            <TouchableOpacity  style={styles.stuffStautsTelCon} onPress={() => this._phonePressed(rowData.tel)}>
                                <Image style={styles.stuffStautsIconPhone} source={require("../img/btn_phone.png")}/>
                            </TouchableOpacity>
                        </View>

                    </View>
                </TouchableHighlight>
            );
        },
        _phonePressed:function(tel) {
            //console.log(tel);
            if (tel)
                Linking.openURL('tel://'+tel)
        },
        _showActionSheet:function (obj) {
            var navigatorPro = this.state.navigatorPro;
            var Buttons = [
                '打电话给 '+obj.username,
                '发短信给 '+obj.username,
                '发邮件给 '+obj.username,
                '查看资料',
                '取消'
            ];
            var events = [];
            events.push(function () {
                if (obj.tel)
                    Linking.openURL('tel://'+obj.tel)
            });
            events.push(function () {
                if (obj.tel)
                    Linking.openURL('sms://'+obj.tel)
            });
            events.push(function () {
                if (obj.email)
                    Linking.openURL('mailto://'+obj.email)
            });
            events.push(function () {
                if(navigatorPro){
                    navigatorPro.push({
                        name:'StuffDetail',
                        component:StuffDetail,
                        params:{
                            data:obj
                        }
                    })
                }

            });

            ActionSheetIOS.showActionSheetWithOptions({
                options:Buttons,
                cancelButtonIndex:Buttons.length - 1
            },function (index) {
                events[index]&&events[index]()
            })
        }
    }
});

