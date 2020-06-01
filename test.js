var fs = require('fs');
var express    =  require("express");
var mysql      = require('mysql');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '6725',
  database : 'sl'
});
var app = express();
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

var test = fs.readFileSync('./html/searchpage.ejs', 'utf8');

app.get('/', (req,res)=>{
  var page = ejs.render(test,{
    title:"Test",
  });
  res.send(page);
})
connection.connect(function(err){
if(!err) {
    console.log("Database is connected ... \n\n");
} else {
    console.log("Error connecting database ... \n\n");
}
});
app.post('/search', function(req,res){
  var body = req.body;
  connection.query('SELECT * from signlanguage where title = ?',[body.test1], function(err, rows, fields) {
  connection.end();
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
app.get("/getdata?",function(req,res){
  connection.query('SELECT * from signlanguage limit 2', function(err, rows, fields) {
  connection.end();
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

app.listen(3000);
