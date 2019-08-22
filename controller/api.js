var express = require("express");
var app = express();

var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("../models");

// A GET route for scraping the WSJ site
app.get("/scrape", function (req, res) {
  // First, we grab the body of the html with axios
  axios.get("http://www.wsj.com/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every data within an article tag, and do the following:
    $("article").each(function (i, element) {
      // Save an empty result object
      var result = {};
      if (i < 15) {
        console.log(i);
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .find("h3")
          .find("a")
          .text();
        result.link = $(this)
          .find("a")
          .attr("href");
        result.summary = $(this)
          .children("p")
          .text();

        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function (dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function (err) {
            // If an error occurred, log it
            console.log(err);
          });
      }
    });
    res.redirect("/")
  });
});



// Route for getting all Articles from the db
app.get("/", function (req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Article.find({})
    .then(function (dbArticle) {
      // If all Notes are successfully found, send them back to the client
      var hbsObject;
      hbsObject = { articles: dbArticle }

      res.render("index", hbsObject)

      // res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    });
});

// Route for getting all Articles from the db
app.get("/saved", function (req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Article.find({ "saved": true })
    // .populate("note")
    .then(function (dbArticle) {
      // console.log(dbArticle);
      // If all Notes are successfully found, send them back to the client
      var hbsSaved;
      hbsSaved = { articles: dbArticle }
      // console.log(hbsSaved);
      res.render("saved", hbsSaved)

      // res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    });
});

app.put("/save/:id", function (req, res) {
  db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: { saved: true } })
    .then(function (data) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(data);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
      res.redirect("/")
    });
});

app.put("/remove/:id", function (req, res) {
  db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: false })
    .then(function (data) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(data)
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
      res.redirect("/")
    });
});


// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {

  db.Article.findOne(
    { _id: req.params.id })
    .populate("note")
    .then(function (dbArticle) {
      // If any Libraries are found, send them to the client with any associated Books
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

app.put("/articles/:id", function (req, res) {
  db.Article.findOneAndUpdate({ _id: req.params.id } , {$set: { author: author, body: body }})
    .then(function (data) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(data)
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
      res.redirect("/saved")
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
  db.Note.create(req.body)
    .then(function (dbNote) {
      // If a Note was created successfully, find one Article (there's only one) and push the new Note's _id to the Article's `notes` array
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true });
    })
    .then(function (dbArticle) {
      // If the Article was updated successfully, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });

});


module.exports = app;