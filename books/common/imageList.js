/**
 * Created by Jerry on 16/4/18.
 */
import React, {
    StyleSheet,
    Text,ScrollView,ListView,
    View,Image,Component,ActionSheetIOS,Linking,
    Dimensions,TouchableHighlight,TouchableOpacity,Navigator
} from 'react-native';
//var styles = require("../common/styles");
/*var Util = require("../common/Util");*/

import styles from '../common/styles'
import Util from '../common/Util'
import Service from '../common/Service';
import StuffDetail from '../common/stuffDetail';


var ImageList = React.createClass({
  getInitialState(){
      var width = Math.floor((Util.size.width - 25)/3);
      var navigatorPro = this.props.routeObj;
      //console.log(this.props.routeObj);
      if(this.props.datasArr != null){
          var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
          return {
              dataSource: ds.cloneWithRows(this.props.datasArr),
              width:width,
              navigatorFa:navigatorPro
          };
      }else{
          var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
          return {
              dataSource: ds.cloneWithRows([]),
              width:width,
              navigatorFa:navigatorPro
          };
      }
  },
  render(){
    return(
        //<ScrollView >
        <ListView
            dataSource={this.state.dataSource}
            renderRow={this._renderRow}
            height={Util.size.height - 110}
            contentContainerStyle={styles.stuffCon}
            initialListSize={12}
        />

       // </ScrollView>
    )

  },
    _renderRow:function (rowData,sectionID,rowID) {

        return(
            <TouchableOpacity onPress={this.showActionSheet.bind(this,rowData,this.state.navigatorFa)} activeOpacity={0.6}>
                <View style={styles.stuffList} width={this.state.width} >
                    <View style={styles.stuffImgView}>
                        {
                            rowData.avatar ?
                                <Image  width={this.state.width - 10} style={styles.stuffImgRad}  source={{uri: Service.host + rowData.avatar}}  />
                                :
                                <Image  width={this.state.width - 10} style={styles.stuffImgRad} source={require("../img/ic_photo.png")}/>
                        }

                    </View>
                    <View style={styles.stuffInfo} width={this.state.width}>
                        <Text style={styles.stuffName}>{rowData.username}</Text>
                        <Text style={styles.stuffPos}>{rowData.position ? rowData.position :'员工'}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    },
    showActionSheet:function (obj,navigatorPro) {
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
    },
    phonePressed:function (tel) {
        if (tel)
            Linking.openURL('tel://'+tel)
    },
    detailInfo:function (data) {
        alert(data)
    }
});

module.exports = ImageList;