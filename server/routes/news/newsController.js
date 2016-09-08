var options = require("../../config/database");
var moment = require('moment');
var mysql = require('mysql');
var async = require('async');
var fs = require('fs');
var crypto = require('crypto');
var formidable = require('formidable');

var express = require('express');
var router = express.Router();

var connection = mysql.createConnection(options);
connection.connect(function(err){
    if (err)
        console.log(err);
});

/* GET users listing. */
router.get('/', function(req, res, next) {
    var id = req.query.id;
    var sqls;
    if(id){
        sqls = {
            'atcsql':'select * from news where id='+id
        };
    }else {
        sqls = {
            'atcsql':'select * from news order by pubtime asc'
        };
    }
    async.series({
        userbookList:function(callback){
            connection.query(sqls['atcsql'],function(err,result){
                if(err){
                    console.log(err);
                    return;
                }
                //console.log(result);
                res.render('newsMana', { 'datas': result });
            });
        }
    });
});

//添加新闻页面跳转
router.get('/addnews', function(req, res, next) {
    res.render('news-add');
});

//添加新闻处理事件
router.post("/addnewsJson",function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';

    form.parse(req,function (err, fields, files) {
        if(err){
            console.log(err);
            res.send({stauts:'NO'});
            return false;
        }

        var pubtime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        var viewtimes = Math.random() * 1000;

        var addSql = 'INSERT INTO news(id,newstitle,publisher,pubtime,viewtimes,newscontent,newstype) VALUES(0,?,?,?,?,?,?)';
        var addParam = [
            fields.newstitle,
            '管理员',
            pubtime,
            viewtimes,
            fields.newsContent,
            fields.newstype
        ];
        connection.query(addSql,addParam,function(err,result){
            if(err){
                console.log('[INSERT ERROR] - ',err.message);
                return;
            }else{
                res.send({stauts:'OK'});
            }
        });

    })
});


//新闻接口
router.post('/loadNews', function(req, res, next) {
    var id = req.query.id;
    if(id){
        sqls = {
            'atcsql':'select * from news where id='+id
        };
    }else {
        sqls = {
            'atcsql':'select * from news order by pubtime desc'
        };
    }
    async.series({
        userbookList:function(callback){
            connection.query(sqls['atcsql'],function(err,result){
                var list = [];
                for(var i=0;i<result.length;i++){
                    result[i].shorttime = moment(result[i].pubtime).format('MM-DD HH:mm');
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
});


module.exports = router;
