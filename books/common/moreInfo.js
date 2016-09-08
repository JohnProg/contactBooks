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
    PropTypes,
    ActivityIndicatorIOS
} from 'react-native';

import styles from './styles';
import Service from '../common/Service';


export default class moreInfo extends Component{
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

                <View >
                    <View style={[styles.linksLists,styles.listsAvatar,styles.backgroundFFF]}>
                        <View style={[styles.linksListsLeft,styles.listsAvatar]}>
                            <Text style={styles.linksLabelLeft}>头像</Text>
                        </View>
                        <View style={styles.listsAvatarRight}>
                            <Image style={styles.listsAvatarImg}  source={{uri: Service.host + Datas.avatar}} />
                            <View style={styles.linksListsRightIcon}>
                                <Image source={require("../img/ic_more.png")} />
                            </View>

                        </View>
                    </View>

                    <Stuffinfo labelLeftVal={Datas.username} labelLeft={'姓名'} />
                    <Stuffinfo labelLeftVal={Datas.sex} labelLeft={'性别'} />
                    <Stuffinfo labelLeftVal={Datas.tel} labelLeft={'电话'} />
                    <Stuffinfo labelLeftVal={Datas.email} labelLeft={'邮箱'} />
                    <Stuffinfo labelLeftVal={Datas.status} labelLeft={'状态'} />

                </View>

                <View style={styles.linksGroup}>
                    <Stuffinfo labelLeftVal={Datas.bz} labelLeft={'自我介绍'} />

                </View>

            </View>
        )
    }
}

class Stuffinfo extends Component{
    constructor(props){
        super(props);
        this.state={
            labelLeft:this.props.labelLeft,
            labelLeftVal:this.props.labelLeftVal
        }
    }
    render(){
        return(
            <View style={[styles.linksLists,styles.backgroundFFF]}>
                <View style={styles.linksListsLeft}>
                    <Text style={styles.linksLabelLeft}>{this.state.labelLeft}</Text>
                    <Text style={styles.linksLabelCenter} numberOfLines={1}>{this.state.labelLeftVal}</Text>
                </View>
                <View style={styles.linksListsRightIcon}>
                    <Image source={require("../img/ic_more.png")} />
                </View>
            </View>
        )
    }

}

