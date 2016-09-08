
/**
 * Created by Jerry on 16/4/27.
 */


import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Text,ScrollView,ListView,
    View,Image,
    TouchableOpacity,
    Platform,
    PropTypes,NavigatorIOS,
    ActivityIndicatorIOS,NetInfo
} from 'react-native';


import styles from '../common/styles';
import ImageList from '../common/imageList';
import TextList from '../common/textList';
import Service from '../common/Service';
import Search from '../common/search';
import DatasLib from './datasLib'


export default class indexList extends Component{
    constructor(props){
        super(props);
        this.state ={
            selectedTab:'index',
            imgModle:false,
            datasList:null
        }
    }
    select(tabName){
        this.setState({
            selectedTab:tabName
        })
    }
    componentWillMount(){
        if(!this.state.datasList){
            this.getPhoneBooksPos();
        }
    }
    componentWillReceiveProps(){
        this.getPhoneBooksPos();
    }
    searchRoute(){
        //console.log(this.props.navigator);
        this.props.navigator.push({
            name:'seachView',
            component:Search,
            params:{
                routeObj:this.props.navigator
            }
        })
    }
    render(){
        return(
            <View style={{marginTop:25}}>
                <View style={styles.header}>
                    <Text style={[styles.flex,styles.headerTxt]}>同事簿</Text>
                    <View style={styles.searchCon}>
                        <TouchableOpacity style={styles.headerBtn} onPress={this.searchRoute.bind(this)}>
                            <Image source={require("../img/actionbar_search.png")} />
                        </TouchableOpacity>

                    </View>
                </View>
                {
                    this.state.datasList ?
                        <View>
                            <TextList datasArr={  this.state.datasList } routeObj={this.props.navigator} datas={this.state.datasList}></TextList>
                        </View>
                        :
                        null
                }
            </View>
        )
    }
    getPhoneBooksPos(){
        var _this = this;
        DatasLib.getPhoneBooks((data)=>{
            _this.setState({
                datasList:data
            });
            _this.forceUpdate();
        },()=>{
            Alert.alert(
                '提示',
                '加载失败！'
            )
        });

    }
   /* changeModle(){
        var status = this.state.imgModle;
        if(status){
            this.setState({
                imgModle:false
            })
        }else{
            this.setState({
                imgModle:true
            })
        }
    }*/

}

