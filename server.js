// imports
const express = require("express");
const app = express();

// uses
app.use(express.static("public"));
app.use(express.json());
app.set("view engine", "ejs");

// routes
app.use("/auth", require("./routes/auth"));
app.use("/student", require("./routes/student"));
app.use("/warden", require("./routes/warden"));

app.listen(3000, () => {
  console.log("Running on port 3000");
});
