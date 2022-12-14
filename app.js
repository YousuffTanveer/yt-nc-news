const express = require("express");
const app = express();

const { getTopics, getArticles } = require("./controllers/controller");

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "invalid endpoint path" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
