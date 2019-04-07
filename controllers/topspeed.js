const express = require("express");
const router = express.Router();
const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");

// router.get("/", (req, res) => {
//     res.render("index");
// });

// GET route for scraping the "Topspeed" website
router.get("/scrape", (req, res) => {

    axios.get("https://www.topspeed.com/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        const $ = cheerio.load(response.data);

        $("h3").each(function (i, element) {
            
            // Save and empty result object
            let result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this).text();
            result.link = $(this).parent().attr("href");

            console.log(result);
            // Create a new Article using the "result" object built from scraping
            db.Article.create(result).then((dbArticle) => {
                console.log(dbArticle);
            }).catch((err) => {
                console.log(err);
            });
        });
        // Send a message to the client
        res.send("Scrap Complete");
    });
});

// Route for getting all Articles from the db
router.get("/articles", (req, res) => {
    db.Article.find().then((data) => {
        res.json(data);
    }).catch((error) => {
        console.log(error);
        res.json(false);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
router.get("/articles/:id", (req, res) => {
    db.Article.find({ _id: new ObjectId(req.params.id) }).then((data) => {
        res.json(data);
    }).catch((error) => {
        console.log(error);
        res.json(false);
    });
});

// Route for saving/updating an Articles associated Note
router.post("/articles/:id", (req, res) => {
    // Create a note
    db.Note.create(req.body).then((data) => {
        // Get the note id from the data
        let noteId = data._id;
        // Find the article by the params.id and update using the note id
        db.Article.findOneAndUpdate({ _id: new ObjectId(req.params.id) }, { $set: { note: noteId } })
            .populate("note")
            .then((articleData) => {
                res.json(articleData);
            });
    }).catch((error) => {
        console.log(error);
        res.json(false);
    });
});

module.exports = router;