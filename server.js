var express = require('express')
var mysql = require('mysql');
var app = express();
var cors = require('cors')
const bodyparser = require('body-parser');

app.use(cors())

const port = process.env.PORT || 5000;

app.use(bodyparser.urlencoded({extended:true}));

app.use(bodyparser.json());

var con = mysql.createConnection({
   host: "localhost",
   user: "root",
   password: "",
   database:"demojwt"
 });
const sql = "SELECT * FROM users"
con.connect(function(err) {
if (err) throw err;
   console.log("Connected!");
   con.query(sql, (err, result)=> {
      if (err) throw err;
      console.log("Result: " + JSON.stringify(result));
    });
});

// respond with "hello world" when a GET request is made to the homepage
app.get('/api/get', (req, res) => {
   con.query(sql, (err,result)=>{
      return res.send(result);
   })
})
app.listen(port,()=>console.log(`Example app listening at http://localhost:${port}`))