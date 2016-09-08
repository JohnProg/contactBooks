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
    PropTypes,Linking,
    ActivityIndicatorIOS,TouchableHighlight
} from 'react-native';

import styles from './styles';
import Service from '../common/Service';
import { Form, InputField,
    Separator, SwitchField, LinkField ,
    PickerField, DatePickerField
} from '../common/forms';
import MoreInfo from '../common/moreInfo';

export default class stuffDetail extends Component{
    constructor(props){
        super(props);
       // console.log(this.props.data);
        this.state ={
            datas:this.props.data
        }
    }
    backRoute(){
        this.props.navigator.pop()
    }
    moreInfo(){
        this.props.navigator.push({
            name:'MoreInfo',
            component:MoreInfo,
            params:{
                data:this.state.datas
            }
        })
    }
    telPressed(tel){
        if (tel)
            Linking.openURL('tel://'+tel)
    }
    msgPressed(msg){
        if (msg)
            Linking.openURL('sms://'+msg)
    }
    render(){
        //console.log(this.props.data)
        var Datas = this.props.data;
        //console.log(Datas);
        return(
            <View style={{marginTop:25}}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.headerBtn} onPress={this.backRoute.bind(this)}>
                        <Image source={require("../img/btn_return.png")} />
                    </TouchableOpacity>
                    <Text style={styles.headerTxt}>同事资料</Text>
                    <TouchableOpacity style={styles.headerBtn} >

                    </TouchableOpacity>
                </View>
                <View>
                    <View style={styles.stuffDetailAvatar}>
                        {
                            Datas.avatar ?
                                <Image style={styles.stuffDetailAvatarImg} source={{uri: Service.host + Datas.avatar}} />
                            :
                                <Image style={styles.stuffDetailAvatarImg} source={require('../img/icon.png')} />
                        }

                        <View style={styles.stuffDetailAvatarRight}>
                            <View style={styles.stuffDetailAvatarRightName}>
                                <Text style={styles.stuffDetailAvatarRightNameTxt}>{Datas.username}</Text>
                                {
                                    Datas.status ?
                                <View style={[styles.stuffStautsTxtCon,styles.marginLeft10]}>
                                    <Text style={styles.stuffStautsTxt}>{Datas.status}</Text>
                                </View>
                                    :null
                                }

                            </View>
                            <View style={styles.stuffDetailAvatarRightPos}>
                                <Text style={styles.stuffDetailAvatarRightPosTxt}>员工</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.stuffDetailTelCon,styles.borderBottomCCC]}>
                        <Text style={styles.stuffDetailTelLabel}>手机号码</Text>
                        <Text style={styles.stuffDetailTel}>{Datas.tel}</Text>
                    </View>
                    <View style={[styles.stuffDetailBtnsCon,styles.borderBottomCCC]}>
                        <TouchableHighlight onPress={this.telPressed.bind(this,Datas.tel)}>
                            <View style={styles.stuffDetailBtnsTel}>
                                <Image style={styles.stuffDetailBtnsTelImg} source={require('../img/btn_call.png')} />
                                <Text style={styles.stuffDetailTelLabel}>打电话</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={this.telPressed.bind(this,Datas.tel)}>
                            <View style={styles.stuffDetailMsgTel}>
                                <Image  style={styles.stuffDetailBtnsTelImg} source={require('../img/btn_call.png')} />
                                <Text style={styles.stuffDetailTelLabel}>发短信</Text>
                            </View>
                        </TouchableHighlight>

                    </View>

                    <View style={styles.linksGroup}>
                        <TouchableHighlight onPress={this.moreInfo.bind(this)}>
                            <View>
                                <LinkField label="更多" iconRight={<Image source={require("../img/ic_more.png")} />} />
                            </View>
                        </TouchableHighlight>
                    </View>



                </View>
                

            </View>
        )
    }
}



