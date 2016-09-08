/**
 * Created by Jerry on 2016/1/20 0020.
 */
var config = require("./config");

var options = {
    'host': config.dbhost,
    'port': config.port,
    'user': config.user,
    'password': config.password,
    'database': config.db,
    'connectionLimit': config.maxConnLimit,
    'supportBigNumbers': true,
    'bigNumberStrings': true
};

module.exports = options;


