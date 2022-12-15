const {
  selectTopics,
  selectArticles,
  selectArticleById,
} = require("../models/model");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send(topics);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { id } = req.params;
  selectArticleById(id)
    .then((article) => {
      const articleObj = { article: article[0] };
      res.status(200).send(articleObj);
    })
    .catch((err) => {
      next(err);
    });
};
