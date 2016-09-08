
/**
 * Created by Jerry on 16/4/18.
 */
import React, {
    PixelRatio
} from 'react-native';
import Dimensions from 'Dimensions'

export default {
  pixel: 1/ PixelRatio.get(),
  size:{
      width:Dimensions.get('window').width,
      height:Dimensions.get('window').height
  }
}

