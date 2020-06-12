var fs = require('fs');
var express = require("express");
var mysql = require('mysql');
var ejs = require('ejs');
var bodyParser = require('body-parser');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '6725',
  database: 'sl'
});
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var options = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '6725',
  database: 'sl'
};
var sessionStore = new MySQLStore(options);
var app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
  secret: "!@!#!$",
  resave: false,
  saveUninitialized: true,
  store: sessionStore
}));
var test = fs.readFileSync('./html/searchpage.ejs', 'utf8');
var mydir = fs.readFileSync('./html/mydir.ejs', 'utf8');
var login = fs.readFileSync('./html/login.html', 'utf8');
var main = fs.readFileSync('./html/main.ejs', 'utf8');
var loginusername="";
//첫화면 설정
app.get('/', (req, res) => {
  var page = ejs.render(main, {
    title: "Test",
  });
  res.send(page);
})
app.get('/searchpage', function (req, res) {
  var page = ejs.render(test, {
    title: "search page",
  });
  res.send(page);
});
app.get('/mydir',function(req,res){connection.query('SELECT img from signlanguage as A LEFT JOIN dir as B on A.slid = B.slid where userid = ?', [loginusername], function (err, rows, fields) {
    if (!err){
      var page = ejs.render(test, {
        title: "good",
        data: rows,
      });
      res.send(page);
    }
    else
      console.log('Error while performing Query.');
  });
});
connection.connect(function (err) {
  if (!err) {
    console.log("Database is connected ... \n\n");
  } else {
    console.log("Error connecting database ... \n\n");
  }
});
//단어검색에 사용
app.post('/search1', function (req, res) {
  console.log("test2");

  var body = req.body;
  connection.query('SELECT * from signlanguage where title LIKE ?', '%' + [body.test1] + '%', function (err, rows, fields) {
    if (!err) {
      var page = ejs.render(test, {
        title: "good",
        data: rows,
      });
      res.send(page);
      console.log('The solution is: ', rows);
    }
    else
      console.log('Error while performing Query.');
  });
});
//단어장에 추가 기능
app.post('/adddir1', function (req, res) {
  var body = req.body;
  console.log('addtest', req.session.id, body.test2);
  connection.query('INSERT INTO dir(userid,slid) values(?,?)', [loginusername, body.test2], function (err, rows, fields) {
    connection.query('SELECT img from signlanguage as A LEFT JOIN dir as B on A.slid = B.slid where userid = ?', [loginusername], function (err, row, fields) {
      if (!err) {
        var page = ejs.render(mydir, {
          title: "good",
          data: row,
        });
        res.send(page);
        console.log('The solution issss: ', rows);

        console.log('The solution is: ', row);
      }
      else
        console.log('Error while performing Query.');
    });
  });
});
//회원가입 테스트

app.post('/signup1', function (req, res) {
  console.log("signtest");
  var body = req.body;
  console.log("sign in test2", body.username, body.password);
  connection.query('INSERT INTO user(userid,pw) values(?,?)', [body.username, body.password], function (err, rows, fields) {
    if (!err) {
      console.log("sign in test1", rows);
      console.log("sign in test2", body.username, body.password);
    }
    else
      console.log('Error while performing Query.');
  });
});

//로그인 test
app.post('/login1', function (req, res) {
  console.log("logintest");
  var body = req.body;
  loginusername = body.username;
  connection.query('select * from user where userid = ? and pw =?', [body.username, body.password], function (err, row, fields) {
    if (!err) {
      req.session.id = req.body.username;
      console.log("sign in test1", req.session.id);
      req.session.save(function () {
        res.redirect('/');
      });
    }
    else if (err) throw err;
  });
});
app.get('/logout', function (req, res) {
  delete req.session.id;
  console.log("test12",req.session.id);
  loginusername="";
  req.session.save(function () {
    res.redirect('/');
  });
});
//문장검색에 사용
/*
app.post('/search2', function(req,res){
  var body = req.body;
var mod = require('korean-text-analytics');
var task = new mod.TaskQueue();
mod.ExecuteMorphModule("안녕하세요 만나서 반갑습니다.", function(err, rep){
  console.log(err, rep);
  console.log(err, rep['morphed']);

  console.log("test:",rep['morphed'][0]['word']);

  connection.query('SELECT * from signlanguage where title = ?',[rep['morphed'][0]['word']], function(err, rows, fields) {
    if (!err){
      var page = ejs.render(test,{
      title : "good",
      data : rows,
      });
      res.send(page);
      console.log('The solution is: ', rows);
      }
      else
        console.log('Error while performing Query.');
      });
  });
});*/
app.listen(3000);