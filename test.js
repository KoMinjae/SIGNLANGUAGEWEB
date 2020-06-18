var fs = require('fs');
var express = require("express");
var mysql = require('mysql');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'sl'
});
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var options = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '1234',
  database: 'sl'
};
var sessionStore = new MySQLStore(options);
var app = express();

app.use(express.static('public')); //css파일 불러오기
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())
app.use(session({
  secret: "!@!#!$",
  resave: false,
  saveUninitialized: true,
  store: sessionStore
}));
var test = fs.readFileSync('./html/searchpage.ejs', 'utf8');
var mydir = fs.readFileSync('./html/mydir.ejs', 'utf8');
var login = fs.readFileSync('./html/login.ejs', 'utf8');
var main = fs.readFileSync('./html/main.ejs', 'utf8');
var signup = fs.readFileSync('./html/signup.ejs', 'utf8');
var loginusername = "";
var checksession = ""; //로그인 세션 변수
var lastsearch = new Array(); //최근검색어 저장 리스트
//첫화면 설정
app.get('/', (req, res) => {
  if(req.session.id==checksession){
    console.log("test1",req.session.id,checksession);
  var page = ejs.render(main, {
    title: loginusername+"님의 메인화면",
    text : loginusername+"님 환영합니다",
    data2 : lastsearch,
  });
}else{
  console.log("test2",req.session.id, checksession);
  var page = ejs.render(main, {
    title: "메인",
    data2 : lastsearch,
  });
}
  res.send(page);
});
app.get('/searchpage', function(req, res) {
  var page = ejs.render(test, {
    title: "search page",
  });
  res.send(page);
})
app.get('/login', function(req, res) {
  var page = ejs.render(login, {
    title: "Login",
  });
  res.send(page);
})
app.get('/signup', function(req, res) {
  var page = ejs.render(signup, {
    title: "SIGNUP",
  });
  res.send(page);
})
app.get('/mydir', function(req, res) {
  connection.query('SELECT img from signlanguage as A LEFT JOIN dir as B on A.slid = B.slid where userid = ?', [loginusername], function(err, rows, fields) {
    if (!err) {
      var page = ejs.render(test, {
        title: "good",
        data: rows,
      });
      res.send(page);
    } else
      console.log('Error while performing Query.');
  });
});
connection.connect(function(err) {
  if (!err) {
    console.log("Database is connected ... \n\n");
  } else {
    console.log("Error connecting database ... \n\n");
  }
});
//단어검색에 사용
app.post('/search1', function(req, res) {
  console.log("test2");

  var body = req.body;
  connection.query('SELECT * from signlanguage where title LIKE ?', '%' + [body.test1] + '%', function(err, rows, fields) {
    if (!err) {
      var page = ejs.render(test, {
        title: "good",
        data: rows,
      });
      res.send(page);
      console.log('The solution is: ', rows);
    } else
      console.log('Error while performing Query.');
  });
});
//단어장에 추가 기능
app.post('/adddir1', function(req, res) {
  var body = req.body;
  console.log('addtest', req.session.id, body.test2);
  connection.query('INSERT INTO dir(userid,slid) values(?,?)', [loginusername, body.test2], function(err, rows, fields) {
    connection.query('SELECT img from signlanguage as A LEFT JOIN dir as B on A.slid = B.slid where userid = ?', [loginusername], function(err, row, fields) {
      if (!err) {
        var page = ejs.render(mydir, {
          title: "good",
          data: row,
        });
        res.send(page);
        console.log('The solution issss: ', rows);

        console.log('The solution is: ', row);
      } else
        console.log('Error while performing Query.');
    });
  });
});
//회원가입 테스트
app.post('/signup1', function(req, res) {
  console.log("signtest");
  var body = req.body;
  if (blankcheck(body.username, body.userID, body.password, body.password_check)) {
    console.log(body.userID, body.password, body.username);

    connection.query('INSERT INTO user(userid,pw,name) values(?,?,?)', [body.userID, body.password, body.username], function(err, rows, fields) {
      if (!err) {
        console.log("sign in test1", rows);
        console.log("sign in test2", body.userID, body.password, body.username);
        res.redirect('/');
      } else
        console.log('Error while performing Query.');
    });
  }
});
//아이디 중복확인
/*app.post('/idcheck1', function(req, res) {
  console.log("idcheck");
  var body = req.body;

  if (body.userID > 1) { //아이디 값 있는기 검사
    connection.query('select * from user where userid = ?', [body.userID], function(err, row, fields) {
      if (!err) {
        if (rows)
          console.log("1111");
      } else {
        console.log("2222");
      }
    });
  } else {
    console.log("아이디 공백");
  }
});*/
//로그인 test
app.post('/login1', function(req, res) {
  console.log("logintest");
  var body = req.body;
  if (blank(body.userID, body.password)) {
    console.log('id', body.userID, 'pw', body.password);
    loginusername = body.userID;
    connection.query('select * from user where userid = ? and pw =?', [body.userID, body.password], function(err, results, rows) {
      if (!err) {
        if (results != '') {
          loginusername = results[0].name;
          console.log(results);
          console.log("이름", results[0].name);
          req.session.id = req.body.userID;
          checksession = req.session.id;
          console.log("sign in test1", req.session.id);
          req.session.save(function() {
            res.redirect('/');
          });
        } else {
          console.log("아이디 비번 확인");
        }
      } else {
        console.log("query error");
      }
    });
  }
  /*var page = ejs.render(login, {
    title: "메인",
    text1: "아이디와 비밀번호를 입력해주세요",
    data2 : lastsearch,
  });
  res.send(page);*/

});
app.get('/logout', function (req, res) {
  console.log("로그아웃")
  loginusername = "";
  req.session.destroy(
    function (err) {
      res.redirect('/');
    });

});

function blankcheck(name, id, pw, pw_ck) { //공백이랑 비밀번호 같은지 검사
  //아이디 비밀번호 조건주기
  if (name.length < 1 || id.length < 1 || pw.length < 1 || pw_ck.length < 1) {
    //이름은 2글자 이상 아이디 비번 6글자 이상
    console.log("글자수, 공백");
    return false;
  } else if (pw != pw_ck) {
    //비밀번호 검사
    console.log("비밀번호 다름");
    return false;
  } else {
    console.log("통과");
    return true;
  }
}

function blank(id, pw) {
  if (id.length < 1 || pw.length < 1) {
    console.log("공백");
    return false;
  } else {
    console.log("통과");
    return true;
  }
}
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
