/**
 * Created by Jerry on 16/4/25.
 */
import React, {
    StyleSheet,
    Text,ScrollView,ListView,
    View,Image,Component,ActionSheetIOS,Linking,
    Dimensions,TouchableHighlight,TouchableOpacity,ActivityIndicatorIOS
} from 'react-native';

import MsgDetail from './msgDetail';
import styles from '../common/styles';
import Util from '../common/Util'
import Service from '../common/Service';
import RefreshableListView from 'react-native-refreshable-listview';

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const postUrl = Service.host + Service.getNews;

export default class MsgList extends Component{
    constructor(props){
        super(props);
        var navigatorPro = this.props.navigator;

        this.state={
            navigatorFa:navigatorPro,
            //datasList:[],
            dataSource: ds.cloneWithRows([]),
            loaded:false
        },
        this.bindMethods();
    }
    componentWillReceiveProps(){
        this.reloadData();
    }
    bindMethods() {
        if (! this.bindableMethods) {
            return;
        }

        for (var methodName in this.bindableMethods) {
            this[methodName] = this.bindableMethods[methodName].bind(this);
        }
    }
    componentWillMount(){
        var _this = this;
        this.setState({
            loaded:false
        });
        this.reloadData();
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
            <View>
                <View style={[styles.headerMsg,styles.marginTop25]}>
                    <Text style={[styles.flex,styles.headerMsgTxt]}>消息</Text>
                </View>

                <RefreshableListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                    loadData={this.reloadData}
                    enableEmptySections={true}
                    refreshDescription="正在加载..."
                    height={Util.size.height - 110}
                />
            </View>
        )
    }
}

Object.assign(MsgList.prototype, {
    bindableMethods : {
        _renderRow : function (rowData, sectionID, rowID) {
            return (
                <TouchableHighlight onPress={()=>this._showNewsDetail(rowData)}>
                    <View style={styles.msgListCon}>

                        <View style={styles.msgListRight}>
                            <View style={styles.msgListTitleCon}>
                                <Text style={styles.msgListUsername} >{rowData.newstitle}</Text>
                                <Text style={styles.msgListdatetime}>{rowData.pubtime}</Text>
                            </View>
                            <View style={styles.msgListIntrCon}>
                                <Text style={styles.msgListIntrConTxt} numberOfLines={2}>{rowData.newscontent}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>
            );
        },
        _showNewsDetail:function(obj){
            var navigatorFa = this.state.navigatorFa;
            if(navigatorFa){
                navigatorFa.push({
                    name:'MsgDetail',
                    component:MsgDetail,
                    params:{
                        data:obj
                    }
                })
            }
        },
        reloadData:function(){
            var _this = this;
            fetch(postUrl,{
                method:'post'
            }).then((response)=>{
                //console.log(response)
                return response.json();
            }).then((responseText)=>{
                //console.log(responseText.datas.userbookList)
                _this.setState({
                    dataSource: ds.cloneWithRows(responseText.datas.userbookList),
                    loaded:true
                });
            }).catch((error)=>{
                console.log(error)
            }).done()
        }
    }
});
