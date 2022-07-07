const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const path = require("path");

const app = express();
const port = process.env.PORT;
app.use(express.static("dist", { index: false }));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  res.sendFile(path.resolve(__dirname + "/../dist/index.html"));
});

app.listen(port, function() {
  console.log("Server started on port " + port);
});
