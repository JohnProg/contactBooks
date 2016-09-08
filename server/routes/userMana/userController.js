var options = require("../../config/database");
var moment = require('moment');
var mysql = require('mysql');
var fs = require('fs');
var crypto = require('crypto');

var express = require('express');
var router = express.Router();

var connection = mysql.createConnection(options);
connection.connect(function(err){
    if (err)
        console.log(err);
});

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('userMana');
});


router.post('/changePwd',function (req, res, next){


    var token = req.body.userToken;
    var oldPwd = req.body.oldPwd;
    var newPwd = req.body.newPwd;
    var tel = req.body.tel;
    

    console.log(token,oldPwd,newPwd);
    //获取加密
    var sha1 = crypto.createHash('sha1');
    sha1.update(tel);
    //默认密码
    sha1.update(oldPwd);
    //加密密码
    var oldPrePwd = sha1.digest('hex');
    var sqls = "select * from userbook where usertoken ='"+ token +"' and password ='"+oldPrePwd +"'";
    console.log(sqls);

    connection.query(sqls,function (err, result) {
        if(err){
            console.log('[select ERROR] - ',err.message);
            res.send({stauts:'NO'});
            return;
        }else{
            console.log(result);
            if(result.length == 1){
                var shaToken = crypto.createHash('sha1');
                shaToken.update(tel);
                shaToken.update(newPwd);
                shaToken.update(new Date()+'');
                var token = shaToken.digest('hex');

                //获取加密
                var newPwdCrypto = crypto.createHash('sha1');
                newPwdCrypto.update(tel);
                //默认密码
                newPwdCrypto.update(newPwd);
                //加密密码
                var newPrePwd = newPwdCrypto.digest('hex');

                //res.send(result);
                var userModSql = 'UPDATE userbook SET usertoken = ? , password = ?  WHERE tel = ?';
                var userModSql_Params = [token,newPrePwd,tel];

                connection.query(userModSql,userModSql_Params,function (err, result) {
                    if(err) {
                        console.log('[UPDATE ERROR] - ', err.message);
                        return;
                    }else {
                        res.send({status:'OK'});
                        console.log("Token更新成功!");
                        console.log("密码更新成功!");
                    }
                })
            }else{
                res.send({status:'NO'});
            }

        }
        console.log(result);
    })

});



module.exports = router;
