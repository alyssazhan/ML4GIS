// server/index.js

const express = require("express");

const app = express();

const path = require("path");
const PORT = process.env.PORT || 3001;
const env = process.env.NODE_ENV || "development";
const configEnv = require("./config.json").setup.development;
// Have Node serve the files for our built React app
// Without middleware
if (configEnv) {
  process.env.NODE_ENV = "development";
} else {
  process.env.NODE_ENV = "production";
}
console.log("config env is: ", process.env.NODE_ENV);

app.get("/api", function (req, res, next) {
  const options = {
    root: path.join(__dirname),
  };
  const fileName = "config.json";
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log("Sent:", fileName);
    }
  });
});

app.get("/", (req, res) => {
    res.send("The server works well!")
});

const allowCrossDomain = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
};
app.use(allowCrossDomain);

app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
});
