exports.setRequestUrl = function(app){
    var index = require('./index');
    //var user = require('./users');
    var userMana = require('./userMana/userController');
    var phoneBooks = require('./phoneBooks/phoneBooksController');
    var login = require('./login/login');
    var news = require('./news/newsController');

    app.use('/', index);
    app.use('/users', userMana);
    app.use('/phoneBooks', phoneBooks);
    app.use('/login',login);
    app.use('/news',news);
    //app.use('/admin', admin);
   // app.use('/news', news);

};

