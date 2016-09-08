/**
 * Created by Jerry on 16/4/25.
 */
import React, {
    StyleSheet,
    Text,ScrollView,ListView,
    View,Image,Component,ActionSheetIOS,Linking,
    Dimensions,TouchableHighlight,TouchableOpacity
} from 'react-native';

import MsgDetail from './msgDetail';
import styles from '../common/styles';
import Util from '../common/Util'
import Service from '../common/Service';

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class MsgList extends Component{
    constructor(props){
        super(props);
        var navigatorPro = this.props.navigator;

        this.state={
            navigatorFa:navigatorPro,
            //datasList:[],
            dataSource: ds.cloneWithRows([])
        },
        this.bindMethods();
    }
    componentWillReceiveProps(){
        const postUrl = Service.host + Service.getNews;
        var _this = this;
        //console.log(11);
        fetch(postUrl,{
            method:'post'
        }).then((response)=>{
            //console.log(response)
            return response.json();
        }).then((responseText)=>{
            //console.log(responseText.datas.userbookList)
            _this.setState({
                dataSource: ds.cloneWithRows(responseText.datas.userbookList)
            });
        }).catch((error)=>{
            console.log(error);
        }).done()
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
        const postUrl = Service.host + Service.getNews;
        var _this = this;

        fetch(postUrl,{
            method:'post'
        }).then((response)=>{
            //console.log(response)
            return response.json();
        }).then((responseText)=>{
            //console.log(responseText.datas.userbookList)
            _this.setState({
                dataSource: ds.cloneWithRows(responseText.datas.userbookList)
            });
        }).catch((error)=>{
            console.log(error)
        }).done()
    }
    render(){
        return(
            <View>
                <View style={[styles.headerMsg,styles.marginTop25]}>
                    <Text style={[styles.flex,styles.headerMsgTxt]}>消息</Text>
                </View>

                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                    enableEmptySections={true}
                    height={Util.size.height - 110}
                    initialListSize={12}
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
        }
    }
});

/*
var MsgList = React.createClass({
    
    render(){
        return(
            <View style={styles.marginTop25}>
                <View style={styles.headerMsg}>
                    <Text style={[styles.flex,styles.headerMsgTxt]}>消息</Text>

                </View>
                <TouchableHighlight>
                    <View style={styles.msgListCon}>

                        <View style={styles.msgListRight}>
                            <View style={styles.msgListTitleCon}>
                                <Text style={styles.msgListUsername} >标题标题</Text>
                                <Text style={styles.msgListdatetime}>11月10日 22:00</Text>
                            </View>
                            <View style={styles.msgListIntrCon}>
                                <Text style={styles.msgListIntrConTxt} numberOfLines={1}>11</Text>
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>

            </View>
        )    
    }
});

module.exports = MsgList;
*/

