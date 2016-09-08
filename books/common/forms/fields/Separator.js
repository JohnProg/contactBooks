'use strict';

import React from 'react-native';
let { View, StyleSheet, Text} = React;
import Util from '../../Util'

export class Separator extends React.Component{
  render(){
     return(<View style={[formStyles.separatorContainer, this.props.containerStyle]}>
       {
         (this.props.label)?
         <Text style={formStyles.separator}>{this.props.label.toUpperCase()}</Text>
       : null
     }
       </View>
    )
  }
}



  let formStyles = StyleSheet.create({
    form:{

    },
    alignRight:{
       marginTop: 7, position:'absolute', right: 10
    },
    separatorContainer:{
      // borderTopColor: '#C8C7CC',
      // borderTopWidth: 1,
      paddingTop: 35,
      borderBottomColor: '#CCCCCC',
      borderBottomWidth: Util.pixel,

    },
    separator:{

      paddingLeft: 10,
      paddingRight: 10,
      color: '#6D6D72',
      paddingBottom: 7

    },
    fieldContainer:{
      borderBottomWidth: 1,
      borderBottomColor: '#CCCCCC',
      backgroundColor: 'white',
      justifyContent: 'center',
      height: 45
    },
  });
