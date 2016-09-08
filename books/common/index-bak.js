
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
    ActivityIndicatorIOS
} from 'react-native';


import styles from '../common/styles';
import ImageList from '../common/imageList';
import TextList from '../common/textList';
import Service from '../common/Service';
import Search from '../common/search';


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
    changeModle(){
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
    }
    componentWillMount(){
        const postUrl = Service.host + Service.getPhoneBooksPos;
        var _this = this;
        //console.log(postUrl);
        fetch(postUrl,{
            method:'post'
            
        }).then((response)=>{
            //console.log(response)
            return response.json();
        }).then((responseText)=>{
           // console.log(responseText)
            _this.setState({
                datasList:responseText.datas
            });
        }).catch((error)=>{
            console.log(error)
        }).done()
    }
    searchRoute(){
        //console.log(this.props.navigator);
        this.props.navigator.push({
            name:'seachView',
            component:Search
        })
    }
    render(){
        //var stuffList = this.state.datasList;
        //console.log(stuffList);
        return(

            <View style={{marginTop:25}}>
                <View style={styles.header}>
                    <Text style={[styles.flex,styles.headerTxt]}>同事簿</Text>
                    <View style={styles.searchCon}>
                        <TouchableOpacity style={styles.headerBtn} onPress={this.searchRoute.bind(this)}>
                            <Image source={require("../img/actionbar_search.png")} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headerBtn} onPress={this.changeModle.bind(this)}>
                            {
                                this.state.imgModle ?
                                    <Image source={require("../img/btn_list.png")}  />
                                    :
                                    <Image source={require("../img/btn_photo.png")}  />
                            }

                        </TouchableOpacity>
                    </View>
                </View>
                {
                    this.state.datasList ?
                        <View>
                            { this.state.imgModle  ?
                                <ImageList datasArr={  this.state.datasList } routeObj={this.props.navigator}>
                                </ImageList>
                                :
                                <TextList datasArr={  this.state.datasList } routeObj={this.props.navigator}>
                                </TextList>
                            }
                        </View>
                        :
                        null
                }

            </View>


        )
    }


}

