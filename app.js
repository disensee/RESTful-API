//App configuration
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


//DB configuration
mongoose.connect("mongodb://localhost:27017/wikiDB",  {useNewUrlParser: true, useUnifiedTopology: true});
const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model('Article', articleSchema);

///////////////Requests targeting all articles//////////////////////////////////
app.route("/articles")
.get((req, res) => {
  Article.find((err, articles) => {
    if(!err){
      res.send(articles);
    }else{
      res.send(err);
    }
  });
})
.post((req, res) => {

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save((err) => {
    if(!err){
      res.send("Article successfully posted!");
    }else{
      res.send(err);
    }
  });
})
.delete((req, res) => {
  Article.deleteMany((err) => {
    if(!err){
      res.send("All articles deleted successfully!");
    }else{
      res.send(err);
    }
  });
});


///////////////Requests targeting specific articles//////////////////////////////////
app.route("/articles/:articleTitle")

.get((req, res) => {
  Article.findOne({title: req.params.articleTitle}, (err, article) => {
    if(article){
      res.send(article);
    }else{
      res.send("No matching article found!");
    }
  });
})
.put((req, res) => {
  Article.updateOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    (err, result) => {
      console.log(result);
      if(!err){
        res.send("Successfully updated article!");
      }else{
        res.send(err);
      }
    }
  );
})
.patch((req, res) => {
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body},
    (err, result) => {
      console.log(result);
      if(!err){
        res.send("Successfully updated article!");
      }else{
        res.send(err);
      }
    }
  );
}).delete((req, res) => {
  Article.deleteOne({
    title: req.params.articleTitle
  }, (err, reult) => {
    if(!err){
      res.send("Successfully deleted " + req.params.articleTitle + " article");
    }else{
      console.log(err);
    }
  });
});

app.listen(3000, ()=>{
  console.log("Server started on port 3000");
});
