/**
 * Created by Jerry on 16/4/19.
 */
import React, {
    StyleSheet,
    Text,ScrollView,ListView,
    View,Image,Component,ActionSheetIOS,Linking,
    Dimensions,TouchableHighlight,TouchableOpacity,ActivityIndicatorIOS
} from 'react-native';


import styles from '../common/styles';
import Util from '../common/Util';
import Service from '../common/Service';
import StuffDetail from '../common/stuffDetail';
import NetWorkTool from './NetWorkTool';
import DatasLib from './datasLib';

export default class textList extends Component{
    constructor(props){
        super(props);
        var navigatorPro = this.props.routeObj;

        var getSectionDatas = (dataBlob, sectionID) => {
            //console.log(dataBlob[sectionID]);
            return dataBlob[sectionID];
        };

        var getRowDatas = (dataBlob, sectionID, rowID) => {
            //console.log(dataBlob[sectionID + ':' + rowID.id]);
            return dataBlob[sectionID + ':' + rowID];
        };

        this.state = {
            loaded : false,
            dataSource : new ListView.DataSource({
                getSectionHeaderData    : getSectionDatas,
                getRowData              : getRowDatas,
                rowHasChanged           : (row1, row2) => row1 !== row2,
                sectionHeaderHasChanged : (s1, s2) => s1 !== s2
            }),
            navigatorFa:navigatorPro,
            _self:this
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
    componentDidMount(){
        this.setData();
    }
    componentWillReceiveProps(){
        this.setData();
    }
    setData(){
        var listsArr = this.props.datasArr.series,
            listLength = listsArr.length,
            dataBlob = {},
            sectionIDs = [],
            rowIDs = [],
            list,
            users,
            userLength,
            user,
            i,
            j;
        for(i=0;i<listLength;i++){
            list = listsArr[i];
            sectionIDs.push(list.id);
            dataBlob[list.id] = list.name;

            users = list.series;
            userLength = users.length;

            rowIDs[i] = [];

            for (j=0;j<userLength;j++){
                user = users[j];
                rowIDs[i].push(user.id);
                dataBlob[list.id+':'+user.id] = user;
            }
        }
        this.setState({
            dataSource:this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
            loaded:true
        })
    }
    render(){
        if(!this.state.loaded){
            return (
                this.renderLoadingView()
            );
        }

        return this.renderListView();
    }
    renderLoadingView(){
        return(
            <View style={styles.loadingView}>
                <ActivityIndicatorIOS size="large" color="#333"></ActivityIndicatorIOS>
            </View>
        )
    }
    renderListView(){
        return(
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderRow}
                renderSectionHeader = {this.renderSectionHeader}
                height={Util.size.height - 110}
            />
        )
    }
    renderSectionHeader(sectionData, sectionID) {
        //console.log(sectionID)
        return (
            <View style={styles.posHeader}>
                <Text style={styles.posHeaderText}>{sectionData}</Text>
            </View>
        );
    }
}

Object.assign(textList.prototype, {
    bindableMethods : {
        renderRow : function (rowData, sectionID, rowID) {
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
            var navigatorPro = this.state.navigatorFa;
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
                //console.log(obj);
                DatasLib.getPhoneBooksById(obj.id,(data)=>{
                    navigatorPro.push({
                        name:'StuffDetail',
                        component:StuffDetail,
                        params:{
                            data:data
                        }
                    });
                   // console.log(data)
                },()=>{
                    Alert.alert(
                        '提示',
                        '加载用户信息失败，请重试！'
                    );
                });

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
