//var mysql      = require('mysql');
// 비밀번호는 별도의 파일로 분리해서 버전관리에 포함시키지 않아야 합니다. 
//var connection = mysql.createConnection({
//  host     : 'localhost',
//  port : '3306',
//  user     : 'root',
//  password : '6725',
//  database : 'sl'
//});

//connection.connect();

//connection.query('SELECT * FROM signlanguage', function (error, results, fields) {
//    if (error) {
//        console.log(error);
//    }
//    console.log(results);
//});

//connection.end();
var express    =  require("express");  
var mysql      = require('mysql');  
var connection = mysql.createConnection({  
  host     : 'localhost',  
  user     : 'root',  
  password : '6725',  
  database : 'sl'  
});  
var app = express();  
  
connection.connect(function(err){  
if(!err) {  
    console.log("Database is connected ... \n\n");    
} else {  
    console.log("Error connecting database ... \n\n");    
}  
});  
  
app.get("/",function(request,response){  
connection.query('SELECT * from signlanguage limit 2', function(err, rows, fields) {  
connection.end();  
  if (!err){  
    response.send(rows);   
    console.log('The solution is: ', rows);  
  }  
  else  
    console.log('Error while performing Query.');  
  });  
});  
  
app.listen(3000);  
