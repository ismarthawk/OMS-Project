// imports
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// environmental variables
const dotenv = require("dotenv").config({
  path: "./config/config.env",
});
const connectDB = require("./config/db");
const db = connectDB();

// uses
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");

// routes
app.use("/auth", require("./routes/auth"));
app.use("/student", require("./routes/student"));
app.use("/warden", require("./routes/warden"));

app.listen(3000, () => {
  console.log("Running on port 3000");
});
