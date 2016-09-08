/**
 * Created by Jerry on 16/5/9.
 */
import Storage from 'react-native-storage';

var storage = new Storage({
    size:1000,
    defaultExpires:1000 * 3600 * 24 * 7,
    enableCache:true,
    /*sync:{
        
    }*/
});

module.exports = storage;