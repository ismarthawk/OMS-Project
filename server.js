// imports
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
// environmental variables

// const dotenv = require("dotenv").config({
//   path: "./config/config.env",
// });
// const connectDB = require("./config/db");
// const db = connectDB();


//DataBase
mongoose.connect('mongodb://localhost:27017/OMS', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })


// uses
app.use(express.static("public"));
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(session({secret: 'secret'}))


//sessions
const isStudent = (req, res, next) => {
  if (!req.session.student_id) {
      return res.redirect('../auth/login')
  }
  next();
}

const isWarden = (req, res, next) => {
  if (!req.session.user_id) {
      return res.redirect('../auth/login')
  }
  next();
}



// routes
app.use("/auth", require("./routes/auth"));
app.use("/student",isStudent, require("./routes/student"));
app.use("/warden",isWarden, require("./routes/warden"));

app.listen(3000, () => {
  console.log("Running on port 3000");
});
