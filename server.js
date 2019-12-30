var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var mysql = require("mysql");
var inquirer = require("inquirer");
var moment = require("moment");
//cheerio stuff 
// Parses our HTML and helps us find elements
var cheerio = require("cheerio");
// Makes HTTP request for HTML page
var request = require("request");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Set our port to 8080
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ACU_db"
});


console.log("Moment test:" + moment().format('YYYY-MM-DD'));
var newsArray = [];

function fill() {
  connection.query("SELECT * FROM acnews ORDER BY dayt DESC;", function(err, result) {
    if (err) throw err;
    

 
    var i;
   

    for (i = 0; i < result.length; i++) { 
  newsArray.push(result[i]);
}

app.get("/api/news", function(req, res) {
  return res.json(newsArray);
});
});
};


app.get("/", function(req, res) {
  //connection.end();
  res.sendFile(path.join(__dirname, "index.html"));
  
fill();

});

app.get("/buy", function(req, res) {
  //connection.end();
  res.sendFile(path.join(__dirname, "buy.html"));

});

//weird, even when I change both to "buy, it still goes back to the main page"
app.post("/", function(req, res) {

var date = moment().format('YYYY-MM-DD');

console.log(date);

  connection.query("INSERT INTO purchases (platform, dayt) VALUES (?,?)", [req.body.platform, date], function(err, result) {
    if (err) {
      throw err;
    }

    res.redirect("/");
  });
});