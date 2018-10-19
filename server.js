
var express = require("express");
var mongoose = require("mongoose");
var logger = require("morgan");
var express = require("express-handlebars");
var cheerio = require("cheerio");
var axios = require("axios");
var db = require("./models");
var PORT =3000;
var app = express();
app.use(logger("dev"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("public"));
mongoose.connect("mongodb://localhost/NewsArticle", { useNewUrlParser: true });
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

app.get("/scrape", function(req, res) {

    axios.get("http://www.echojs.com/").then(function(response) {
 
      var $ = cheerio.load(response.data);

      $("article h2").each(function(i, element) {

        var result = {};
  
   
        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");

        db.Article.create(result)
          .then(function(dbArticle) {
            console.log(dbArticle);
          })
          .catch(function(err) {
    
            return res.json(err);
          });
      });
      res.redirect("/")
    });
  });
  

  app.get("/articles", function(req, res) {
 
    db.Article.find({})
      .then(function(dbArticle) {

        res.json(dbArticle);
      })
      .catch(function(err) {

        res.json(err);
      });
  });
  

  app.get("/articles/:id", function(req, res) {

    db.Article.findOne({ _id: req.params.id })

      .populate("note")
      .then(function(dbArticle) {
        
        res.json(dbArticle);
      })
      .catch(function(err) {
   
        res.json(err);
      });
  });
  

  app.post("/articles/:id", function(req, res) {

    db.Note.create(req.body)
      .then(function(dbNote) {
       
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
      
        res.json(dbArticle);
      })
      .catch(function(err) {

        res.json(err);
      });
  });
  
  app.delete("/notes/:id", function(req,res){
    console.log(req.params.id)
    db.Note.findByIdAndRemove(req.params.id, function(err, response){
    
      if (err) throw err;
      res.json(response);    
  
    })
  })

  app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });