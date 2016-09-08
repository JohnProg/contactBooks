var options = require("../../config/database");
var moment = require('moment');
var mysql = require('mysql');
var async = require('async');
var fs = require('fs');
var crypto = require('crypto');

var multiparty = require('multiparty');

var formidable = require('formidable');
//默认上传路径
var AVATAR_UPLOAD_FOLDER = 'upload/';
var express = require('express');
var router = express.Router();

var connection = mysql.createConnection(options);
connection.connect(function (err) {
    if (err)
        console.log(err);
});

//页面加载事件
router.get('/', function (req, res, next) {
    var id = req.query.id;
    var token = req.query.token;
    console.log(id,token);
    var sqls;
    if(id){
        sqls = {
            'atcsql':'select * from userbook where id='+id
        };
    }else if(token){
        sqls = {
            'atcsql':'select * from userbook where usertoken='+token
        };
    }
    else {
        sqls = {
            'atcsql':'select * from userbook'
        };
    }
    async.series({
        userbookList:function(callback){
            connection.query(sqls['atcsql'],function(err,result){
                var list = [];
                for(var i=0;i<result.length;i++){
                    result[i].time = moment(result[i].addtime).format('YYYY-MM-DD HH:mm:ss');
                    list.push(result[i]);
                }
                callback(err,list);
            });
        }
    }, function (err, results) {
        //var datas = JSON.stringify(results);
        //console.log(results);
        res.render('phoneBooks', { 'datas': results });
    });

    // res.render('phoneBooks');
});

//React接口
router.post('/loadStuff', function (req, res, next) {
    var id = req.query.id;
    var token = req.query.token;
    console.log(id,token);
    var sqls;
    if(id){
        sqls = {
            'atcsql':'select * from userbook where id='+id
        };
    }else if(token){
        sqls = {
            'atcsql':'select * from userbook where usertoken='+token
        };
    }
    else {
        sqls = {
            'atcsql':'select * from userbook'
        };
    }
    //加载数据
    async.series({
        userbookList:function(callback){
            connection.query(sqls['atcsql'],function(err,result){
                var list = [];
                for(var i=0;i<result.length;i++){
                    result[i].time = moment(result[i].addtime).format('YYYY-MM-DD HH:mm:ss');
                    list.push(result[i]);
                }
                callback(err,list);
            });
        }
    }, function (err, results) {
        //var datas = JSON.stringify(results);
        //console.log(results);
        res.send({ 'datas': results });
    });

    // res.render('phoneBooks');
});


//React接口
router.post('/loadStuffById', function (req, res, next) {
    var id = req.body.id;
    //console.log(id);
    var sqls;
    if(id){
        sqls = {
            'atcsql':'select * from userbook where id='+id
        };
    }else {
        return;
    }
    //加载数据
    async.series({
        userbookList:function(callback){
            connection.query(sqls['atcsql'],function(err,result){
                var list = [];
                for(var i=0;i<result.length;i++){
                    result[i].time = moment(result[i].addtime).format('YYYY-MM-DD HH:mm:ss');
                    list.push(result[i]);
                }
                callback(err,list);
            });
        }
    }, function (err, results) {
        //var datas = JSON.stringify(results);
        //console.log(results);
        res.send({ 'datas': results });
    });

    // res.render('phoneBooks');
});

router.post('/loadStuffByToken', function (req, res, next) {
    var token = req.body.token;
    console.log(token);
    var sqls;
    if(token){
        sqls = {
            'atcsql':'select * from userbook where usertoken='+token
        };
    }else {
        return;
    }
    //加载数据
    async.series({
        userbookList:function(callback){
            connection.query(sqls['atcsql'],function(err,result){
                var list = [];
                for(var i=0;i<result.length;i++){
                    result[i].time = moment(result[i].addtime).format('YYYY-MM-DD HH:mm:ss');
                    list.push(result[i]);
                }
                callback(err,list);
            });
        }
    }, function (err, results) {
        //var datas = JSON.stringify(results);
        //console.log(results);
        res.send({ 'datas': results });
    });

    // res.render('phoneBooks');
});


//React接口记在部门
router.post('/loadStuffWithPos', function (req, res, next) {
    var id = req.query.id;
    var sqls = 'SELECT t1.*,t2.* FROM userbook t1,userdepart t2 WHERE t1.bmid = t2.depart_cid order by convert(t1.username USING gbk) COLLATE gbk_chinese_ci asc ';

    connection.query(sqls,function(err,result){
        var newResult = datasWithDep(result);
        res.send({ 'datas': newResult });
    });


    // res.render('phoneBooks');
});

function datasWithDep(datas) {
    var newObj = {
        id:'0',
        name:'无锡融合',
        series:[]
    };
    var newArr=[];
    for(var i=0;i<datas.length;i++){
        //部门id
        var datasId = datas[i].bmid;
        //部门集合
        var faSeries = newObj.series;
        var bmOpt ={};
        if(faSeries.length<=0){
            //生成新部门
            bmOpt.id=datas[i].depart_cid;
            bmOpt.name=datas[i].depart_name;
            bmOpt.series = [];
            bmOpt.series.push(datas[i]);
            faSeries.push(bmOpt);
        }else{

            var count = 0;
            //遍历部门
            for(var j=0;j<faSeries.length;j++){
                var posId = faSeries[j].id;
                if(datasId == posId){
                    faSeries[j].series.push(datas[i]);
                }else{
                    //continue;
                    count++;
                }
            }
            if(count==faSeries.length){
                var newOpt={};
                newOpt.id=datas[i].depart_cid;
                newOpt.name=datas[i].depart_name;
                newOpt.series = [];
                newOpt.series.push(datas[i]);
                faSeries.push(newOpt);
            }
        }

    }
    return newObj;
}



//addstuff跳转
router.get("/addstuff",function (req, res, next) {
    //读取部门
    var bmSql = "select * from  userdepart";
    connection.query(bmSql,function(err,result){
        //console.log(result);
        res.render('phoneBooks-add',{'datas': result });
    });

});

//addStuff添加事件

router.post("/addstuffJson",function (req, res, next) {

    //获取传入form
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = 'public'+ AVATAR_UPLOAD_FOLDER;
    form.keepExtensions = true;         //保留扩展名
    form.maxFieldsSize = 2*1024*1024;  //最大2M
    //解析图片格式
    form.parse(req,function (err, fields, files) {
        if(err){
            console.log(err);
            res.send({stauts:'NO'});
            return false;
        }
        var extName = "",avatarName="",newPath="",imgPath="";
        if(files.imgFile){
            switch (files.imgFile.type){
                case 'image/pjpeg':
                    extName = 'jpg';
                    break;
                case 'image/jpeg':
                    extName = 'jpg';
                    break;
                case 'image/png':
                    extName = 'png';
                    break;
                case 'image/x-png':
                    extName = 'png';
                    break;
            }
            if(extName.length == 0){
                res.locals.error = '只支持png和jpg格式图片';
                //res.render('index', { title: TITLE });
                return;
            }

            //加密图片名,避免重复
            avatarName = (Math.random()/+ new Date()).toString(36).replace(/\d/g,'').slice(1) + '.' + extName;
            newPath = form.uploadDir + avatarName;
            imgPath = AVATAR_UPLOAD_FOLDER + avatarName;
            //存储图片
            fs.renameSync(files.imgFile.path, newPath);
        }

        //获取发布时间
        var pubtime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        //获取加密
        var sha1 = crypto.createHash('sha1');
        sha1.update(fields.tel);
        //默认密码
        sha1.update('123456');
        //加密密码
        var prePwd = sha1.digest('hex');
        //插入操作
        var  AddSql = 'INSERT INTO userbook(id,username,sex,avatar,tel,email,addtime,bz,password,bmid,position,status) VALUES(0,?,?,?,?,?,?,?,?,?,?,?)';
        var  AddSql_Params = [
            fields.stuffname,
            fields.sex,
            imgPath,
            fields.tel,
            fields.email,
            pubtime,
            fields.bz,
            prePwd,
            fields.depart,
            fields.position,
            fields.status
        ];
        //执行
        connection.query(AddSql,AddSql_Params,function(err,result){
            if(err){
                console.log('[INSERT ERROR] - ',err.message);
                return;
            }else{
                res.send({stauts:'OK'});
            }
        });

    });

});

//批量修改密码
/*router.post("/changeallpwd",function (req, res, next) {
 var sql = "select * from userbook";


 connection.query(sql,function(err,result){
 if(err){
 console.log(err.message);
 return;
 }else{

 for(var i=0;i<result.length;i++){
 var sha1 = crypto.createHash('sha1');
 sha1.update(result[i].tel);
 sha1.update("123456");
 var newPwd = sha1.digest("hex");

 var upsql = 'update userbook set password =? where id = ?'
 var upPara = [newPwd,result[i].id];

 connection.query(upsql,upPara,function(err,result){
 if(err){
 console.log('[UPDATE ERROR] - ',err.message);
 return;
 }else{
 console.log('----------UPDATE-------------');
 }
 });
 }

 res.send({stauts:result});
 }
 });


 });*/

//检测手机号码是否重复
router.post('/checkMobile',function (req, res, next) {
    var tel = req.body.tel;
    console.log(tel);
    var sql = "select * from userbook where tel = '"+tel+"'";
    connection.query(sql,function(err,result){
        if(err){
            console.log('[UPDATE ERROR] - ',err.message);
            return;
        }else{
            if(result.length>0){
                res.send({"error":"手机号码已经存在！"} );
            }else{
                res.send({"ok":""} );
            }
        }
    });
    console.log(sql);

});

//搜索接口
router.post('/searhBooks',function (req, res, next) {
    var keywords = req.body.keywords;
    var sql = "SELECT * FROM userbook ub where ub.username like '%"+keywords+"%' OR ub.tel like '%"+keywords+"%'";

    console.log(sql);

    connection.query(sql,function (err, result) {
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }else{
            if(result){
                res.send(result);
            }
        }
    });


});


//上传头像
router.post('/uploadAvatar',function (req, res, next) {

    var form = new multiparty.Form();
    form.autoFiles = true;
    form.uploadDir = global.APP_PATH + '/public/upload/';
    //form.maxFilesSize = 5*1024*1024;  //最大5M

    form.parse(req, function (err, fields, files) {
        if(err){
            console.log(err);
            res.send({'status':'NO'});
            return false;
        }
        var extName = "",avatarName="",newPath="",imgPath="";

        var imgFile = files.file[0];
        var imgType = imgFile.headers['content-type'];
        if(imgType) {
            switch (imgType) {
                case 'image/pjpeg':
                    extName = 'jpg';
                    break;
                case 'image/jpeg':
                    extName = 'jpg';
                    break;
                case 'image/png':
                    extName = 'png';
                    break;
                case 'image/x-png':
                    extName = 'png';
                    break;
            }
            if (extName.length == 0) {
                //res.locals.error = '只支持png和jpg格式图片';
                //res.render('index', { title: TITLE });
                return;
            }
        }
        avatarName = (Math.random()/+ new Date()).toString(36).replace(/\d/g,'').slice(1) + '.' + extName;
        newPath = global.APP_PATH + '/public/upload/'+ avatarName;
        imgPath = AVATAR_UPLOAD_FOLDER + avatarName;
        //上传图片
        fs.renameSync(imgFile.path, newPath);

        if(fields.token){
           // console.log(fields.token);
            var updateAvSql = 'update userbook set avatar =? where usertoken = ?';
            var upParam = [imgPath,fields.token];

            connection.query(updateAvSql,upParam,function (err, result) {
                if(err){
                    console.log('[UPDATE ERROR] - ',err.message);
                    res.send({'status':"NO"});
                    return;
                }else{

                    console.log('----------UPDATE AVATAR-------------');
                    console.log('UPDATE AVATAR SUCCESS!');
                    res.send({'status':"OK",'imgPath':imgPath});
                }
            });

        }else{
            console.log('没有token，上传失败!');
            return;
        }
    });


});

//修改性别接口

router.post('/modSex',function (req, res, next) {
    var token = req.body.token;
    var sex = req.body.sex;

    console.log(sex,token);

    var upSql = 'update userbook set sex = ? where usertoken = ?';
    var upParam = [sex,token];

    connection.query(upSql,upParam,function (err, result) {
        if(err){
            console.log('[UPDATE ERROR] - ',err.message);
            res.send({'status':'NO'});
            return;
        }else{
            console.log('----------UPDATE AVATAR-------------');
            console.log('UPDATE SEX SUCCESS!');
            res.send({'status':"OK",'sex':sex});
        }
    })


});


//修改自我介绍
router.post('/modIntro',function (req, res, next) {
    var token = req.body.token;
    var intro = req.body.intro;

    console.log(intro,token);

    var upSql = 'update userbook set bz = ? where usertoken = ?';
    var upParam = [intro,token];

    connection.query(upSql,upParam,function (err, result) {
        if(err){
            console.log('[UPDATE ERROR] - ',err.message);
            res.send({'status':'NO'});
            return;
        }else{
            console.log('----------UPDATE AVATAR-------------');
            console.log('UPDATE INTRO SUCCESS!');
            res.send({'status':"OK",'intro':intro});
        }
    })
});

//修改状态接口

router.post('/modStatus',function (req, res, next) {
    var token = req.body.token;
    var status = req.body.status;

    console.log(status,token);

    var upSql = 'update userbook set status = ? where usertoken = ?';
    var upParam = [status,token];

    connection.query(upSql,upParam,function (err, result) {
        if(err){
            console.log('[UPDATE ERROR] - ',err.message);
            res.send({'status':'NO'});
            return;
        }else{
            console.log('----------UPDATE AVATAR-------------');
            console.log('UPDATE STATUS SUCCESS!');
            res.send({'status':"OK",'statusText':status});
        }
    })


});



module.exports = router;
