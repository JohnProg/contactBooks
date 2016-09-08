/**
 * Created by Jerry on 16/5/9.
 */
var options = require("../../config/database");
var moment = require('moment');
var mysql = require('mysql');
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

//移动端登陆
router.post('/',function (req, res, next) {
    //console.log(req.body);
    //获取登陆信息
    var phone = req.body.phone;
    var pwd = req.body.pwd;
    if(!phone || !pwd){
        res.send({status:'NO'});
        return false;
    }
    var sha1 = crypto.createHash('sha1');
    sha1.update(phone);
    sha1.update(pwd);
    //加密后的密码
    var password = sha1.digest('hex');
    //SQL
    var sql = 'select * from userbook where password = \''+password +'\' and tel = \''+ phone +'\'';
    //查询数据库
    connection.query(sql,function (err, result) {
        //如果失败
       if (result.length <= 0){
           console.log(err);
           res.send({status:'PSWNO'});
       }else{
           //获取加密
           var shaToken = crypto.createHash('sha1');
           shaToken.update(phone);
           shaToken.update(pwd);
           shaToken.update(new Date()+'');

           var thatResutl = result[0];
           //获取用户ID
           var id = thatResutl.id;
           //生成token
           var token = shaToken.digest('hex');
           //返回结果中返回token
           //thatResutl.token = token;

           var userModSql = 'UPDATE userbook SET usertoken = ? WHERE id = ?';
           var userModSql_Params = [token,id];
           console.log(token);
            //改 up
           connection.query(userModSql,userModSql_Params,function (err, result) {
               if(err){
                   console.log('[UPDATE ERROR] - ',err.message);
                   return;
               }else {
                   //更新成功返回最新数据
                   var sql = 'select * from userbook WHERE id ='+ id;
                   connection.query(sql,function (err, result) {
                       if (result.length <= 0){
                           console.log(err);
                           res.send({status:'PSWNO'});
                       }else{

                           console.log(result[0].username + "登录成功!");
                           res.send({data:result});
                       }
                   });
                   console.log(thatResutl.username + "Token更新成功!");
               }
           });

            //插入历史记录
           var tokensql = 'INSERT INTO usertoken(id,userId,userToken,userTime) VALUES(0,?,?,?)';
           var tokenPara =[id,token,new Date()];
            //插入token
           connection.query(tokensql,tokenPara,function (err, result) {
               if(err){
                   console.log('[INSERT ERROR] - ',err.message);
                   return;
               }else{
                   console.log(thatResutl.username + "登录记录插入成功!");
               }
           });


       }
    });


});

router.post('/loginByToken',function (req, res, next) {
    var token = req.body.token;
    console.log(token);
    var tokensql = 'select * from userbook where usertoken = \''+token +'\'';
    console.log(tokensql);
    if(!token){
        res.send('NO');
        return false;
    }
    connection.query(tokensql,function (err, result) {
        if(err){
            res.send('NO');
            console.log('Token登录失败! - ',err.message);
            return;
        }else{
            console.log("使用token登录成功!");
            //console.log(result);
            res.send({datas:result});
        }
    });

});


module.exports = router;


