/**
 * Created by Jerry on 16/7/28.
 */

import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Text,ScrollView,ListView,
    View,Image,
    TouchableOpacity,
    Platform,
    PropTypes,
    ActivityIndicatorIOS,TouchableHighlight
} from 'react-native';

import styles from './styles';
import ChangPwd from './changePwd'
import { Form, InputField,
    Separator, SwitchField, LinkField ,
    PickerField, DatePickerField
} from '../common/forms';
import storage from '../common/storage';

export default class setting extends Component{
    constructor(props){
        super(props);
        this.state={
            navigatorFa:this.props.navigator
        }
    }
    backRoute(){
        var navigatorPro = this.state.navigatorFa;
        navigatorPro.pop()
    }
    showChangePwd(){
        var navigatorPro = this.state.navigatorFa;
        navigatorPro.push({
            name:'ChangPwd',
            component:ChangPwd,
            params:{
                userToken:this.props.userToken,
                userTel:this.props.userTel
            }
        })
    }
    render(){
        return(
            <View style={{marginTop:25}}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.headerBtn} onPress={this.backRoute.bind(this)}>
                        <Image source={require("../img/btn_return.png")} />
                    </TouchableOpacity>
                    <Text style={styles.headerTxt}>设置</Text>
                    <TouchableOpacity style={styles.headerBtn} >

                    </TouchableOpacity>
                </View>
                <View style={styles.linksGroup}>
                    <TouchableHighlight onPress={this.showChangePwd.bind(this)}>
                        <View>
                            <LinkField label="修改密码" iconRight={<Image source={require("../img/ic_more.png")} />} />
                        </View>
                    </TouchableHighlight>


                </View>
            </View>
        )
    }
}