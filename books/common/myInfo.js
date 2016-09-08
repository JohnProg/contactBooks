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
import Aavatar from './avatar';
import storage from '../common/storage';
import Modsex from './modSex';
import ModIntro from './modIntro';
import ModStatus from './modStatus';

export default class myInfo extends Component{
    constructor(props){
        super(props);

        this.state ={
            datas:this.props.data
        }
    }
    componentWillReceiveProps(){
        var _this = this;
        storage.load({
            key: 'user',
        }).then( ret => {
            if(ret){
                _this.setState({
                    datas:ret
                });
            }
        }).catch(err => {
            // 如果没有找到数据且没有同步方法，
            console.warn(err);
        })
    }

    backRoute(){
        this.props.navigator.pop()
    }
    showAvatar(){
        this.props.navigator.push({
            name:'Aavatar',
            component:Aavatar,
            params:{
                data:this.state.datas
            }
        })
    }
    modSex(sex){
        this.props.navigator.push({
            name:'ModSex',
            component:Modsex,
            params:{
                data:sex,
                token:this.state.datas.usertoken
            }
        })
    }
    modIntro(intro){
        this.props.navigator.push({
            name:'ModIntro',
            component:ModIntro,
            params:{
                data:intro,
                token:this.state.datas.usertoken
            }
        })
    }
    modStatus(status){
        this.props.navigator.push({
            name:'ModStatus',
            component:ModStatus,
            params:{
                data:status,
                token:this.state.datas.usertoken
            }
        })
    }
    render(){
        var Datas = this.state.datas;
        return(
            <View style={{marginTop:25}}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.headerBtn} onPress={this.backRoute.bind(this)}>
                        <Image source={require("../img/btn_return.png")} />
                    </TouchableOpacity>
                    <Text style={styles.headerTxt}>个人资料</Text>
                    <TouchableOpacity style={styles.headerBtn} >

                    </TouchableOpacity>
                </View>

                <View >
                    <TouchableOpacity onPress={this.showAvatar.bind(this)}>
                        <View style={[styles.linksLists,styles.listsAvatar,styles.backgroundFFF]} >
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
                    </TouchableOpacity>

                    <View style={[styles.linksLists,styles.backgroundFFF]}>
                        <View style={styles.linksListsLeft}>
                            <Text style={styles.linksLabelLeft}>{'姓名'}</Text>
                            <Text style={styles.linksLabelCenter} numberOfLines={1}>{Datas.username}</Text>
                        </View>
                        <View style={styles.linksListsRightIcon}>
                            <Image source={require("../img/ic_more.png")} />
                        </View>
                    </View>

                    <TouchableOpacity onPress={this.modSex.bind(this,Datas.sex)}>
                        <View style={[styles.linksLists,styles.backgroundFFF]}>
                            <View style={styles.linksListsLeft}>
                                <Text style={styles.linksLabelLeft}>{'性别'}</Text>
                                <Text style={styles.linksLabelCenter} numberOfLines={1}>{Datas.sex}</Text>
                            </View>
                            <View style={styles.linksListsRightIcon}>
                                <Image source={require("../img/ic_more.png")} />
                            </View>
                        </View>
                    </TouchableOpacity>

                    <View style={[styles.linksLists,styles.backgroundFFF]}>
                        <View style={styles.linksListsLeft}>
                            <Text style={styles.linksLabelLeft}>{'电话'}</Text>
                            <Text style={styles.linksLabelCenter} numberOfLines={1}>{Datas.tel}</Text>
                        </View>
                        <View style={styles.linksListsRightIcon}>
                            <Image source={require("../img/ic_more.png")} />
                        </View>
                    </View>

                    <View style={[styles.linksLists,styles.backgroundFFF]}>
                        <View style={styles.linksListsLeft}>
                            <Text style={styles.linksLabelLeft}>{'邮箱'}</Text>
                            <Text style={styles.linksLabelCenter} numberOfLines={1}>{Datas.email}</Text>
                        </View>
                        <View style={styles.linksListsRightIcon}>
                            <Image source={require("../img/ic_more.png")} />
                        </View>
                    </View>

                    <TouchableOpacity onPress={this.modStatus.bind(this,Datas.status)}>
                        <View style={[styles.linksLists,styles.backgroundFFF]}>
                            <View style={styles.linksListsLeft}>
                                <Text style={styles.linksLabelLeft}>{'状态'}</Text>
                                <Text style={styles.linksLabelCenter} numberOfLines={1}>{Datas.status}</Text>
                            </View>
                            <View style={styles.linksListsRightIcon}>
                                <Image source={require("../img/ic_more.png")} />
                            </View>
                        </View>
                    </TouchableOpacity>

                </View>

                <View style={styles.linksGroup}>
                    <TouchableOpacity onPress={this.modIntro.bind(this,Datas.bz)}>
                        <View style={[styles.linksLists,styles.backgroundFFF]}>
                            <View style={styles.linksListsLeft}>
                                <Text style={styles.linksLabelLeft}>{'自我介绍'}</Text>
                                <Text style={styles.linksLabelCenter} numberOfLines={1}>{Datas.bz}</Text>
                            </View>
                            <View style={styles.linksListsRightIcon}>
                                <Image source={require("../img/ic_more.png")} />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
}

class Stuffinfo extends Component{
    constructor(props){
        super(props);
        var rightIcon ;
        if(this.props.rightIcon){
            rightIcon = require(this.props.rightIcon);
        }else{
            rightIcon = require("../img/ic_more.png");
        }
        this.state={
            labelLeft:this.props.labelLeft,
            labelLeftVal:this.props.labelLeftVal,
            rightIcon:rightIcon
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
                    <Image source={this.state.rightIcon} />
                </View>
            </View>
        )
    }

}

