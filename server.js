// imports
const express = require("express");
const app = express();

// uses
app.use(express.static("public"));
app.use(express.json());
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("Student/index");
});

app.listen(3000, () => {
  console.log("Running on port 3000");
});
