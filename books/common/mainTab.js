/**
 * Created by Jerry on 16/4/29.
 */
import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Text,ScrollView,ListView,
    View,Image,
    TouchableOpacity,NavigatorIOS,Navigator
} from 'react-native';

import TabNavigator from 'react-native-tab-navigator';

import styles from '../common/styles';
import MsgList from '../common/msgList';
import MyCenter from '../common/myCenter';
import Index from '../common/index';

export default class mainTab extends Component{
    constructor(props){
        super(props);
        this.state={
            selectedTab:'index',
            datasList:this.props.datas
        }
    }
    select(tabName){
        this.setState({
            selectedTab:tabName
        })
    }
    render(){
        //console.log(11)
        return(
            <TabNavigator style={styles.tabItemBg}>

                <TabNavigator.Item
                    renderIcon={() => <Image source={require("../img/tab_addresslist.png")} />}
                    renderSelectedIcon={() => <Image source={require("../img/tab_addresslist_h.png")} />}
                    selected={this.state.selectedTab ==="index"}
                    onPress={this.select.bind(this,"index")}
                >
                    <Index navigator={this.props.navigator} datas={this.state.datasList}/>

                </TabNavigator.Item>

                <TabNavigator.Item
                    renderIcon={() => <Image source={require("../img/tab_info_.png")} />}
                    renderSelectedIcon={() => <Image source={require("../img/tab_info_h.png")} />}
                    selected={this.state.selectedTab ==="info"}
                    onPress={this.select.bind(this,"info")}
                >
                    <MsgList navigator={this.props.navigator}/>
                </TabNavigator.Item>

                <TabNavigator.Item
                    renderIcon={() => <Image source={require("../img/tab_person.png")} />}
                    renderSelectedIcon={() => <Image source={require("../img/tab_person_h.png")} />}
                    selected={this.state.selectedTab ==="person"}
                    onPress={this.select.bind(this,"person")}
                >
                    <MyCenter navigator={this.props.navigator}/>
                </TabNavigator.Item>

            </TabNavigator>

        )
    }
}