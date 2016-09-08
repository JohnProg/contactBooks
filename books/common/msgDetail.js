/**
 * Created by Jerry on 16/7/27.
 */



import React, {
    StyleSheet,
    Text,ScrollView,ListView,
    View,Image,Component,ActionSheetIOS,Linking,
    Dimensions,TouchableHighlight,TouchableOpacity
} from 'react-native';


import styles from '../common/styles';



export default class MsgList extends Component{
    constructor(props){
        super(props);
        this.state ={
            datas:this.props.data
        }
    }
    backRoute(){
        this.props.navigator.pop();
    }
    render(){
        var detaiData = this.state.datas;
        return(
            <View style={styles.marginTop25}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.headerBtn} onPress={this.backRoute.bind(this)}>
                        <Image source={require("../img/btn_return.png")} />
                    </TouchableOpacity>
                    <Text style={styles.headerTxt}>新闻详情</Text>
                    <TouchableOpacity style={styles.headerBtn} >

                    </TouchableOpacity>
                </View>

                <View>
                    <View style={styles.newsDetailTitle}>
                        <Text style={styles.newsDetailTitleTxt}>{detaiData.newstitle}</Text>
                        <View style={styles.newsDetailPubInfo}>
                            <Text style={styles.newsDetailPubInfoText}>发布人：{detaiData.publisher}</Text>
                            <Text style={styles.newsDetailPubInfoText}>发布时间：{detaiData.pubtime}</Text>
                        </View>
                    </View>
                    <View style={styles.newsDetailPubContent}>
                        <Text style={styles.newsDetailPubContentTxt}>内容内容内容内容内容内容内容</Text>
                    </View>

                </View>

            </View>
            )
    }
}
