const express = require("express");
const app = express();
const cors = require("cors");

const {
  getTopics,
  getArticles,
  getArticleById,
  getComments,
  postComments,
  patchArticles,
} = require("./controllers/controller");

app.use(express.json());
app.use(cors());

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getComments);

app.post("/api/articles/:article_id/comments", postComments);

app.patch("api/articles/:article_id", patchArticles);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "invalid endpoint path" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "invalid id" });
  } else if (err.code === "23503") {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
