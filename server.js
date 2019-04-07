const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");

const logger = require("morgan");
// Import routes and give the server access to them
const routes = require("./controllers/topspeed.js");
// Initialize Express
const app = express();
// Require all models

const PORT = process.env.PORT | 3000;
// MongoDB 
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/mongoHeadlines", { useNewUrlParser: true });

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Set handlebars
app.use("/", routes);
app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Connect to Mongo DB
// mongoose.connect(MONGODB_URI);

mongoose.connect(MONGODB_URI, { useNewUrlParser: true }).then(() => {
console.log("Connected to Database");
}).catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
});

// Start the server
app.listen(PORT, () => {
    console.log("Server listening on http://localhost:" + PORT);
});