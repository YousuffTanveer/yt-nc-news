const {
  selectTopics,
  selectArticles,
  selectArticleById,
  selectComments,
  insertComments,
  updateArticle,
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
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      const articleObj = { article: article[0] };
      res.status(200).send(articleObj);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then(() => {
      return selectComments(article_id);
    })
    .then((commentsArr) => {
      res.status(200).send({ comments: commentsArr });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComments = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([
    selectArticleById(article_id),
    insertComments(article_id, req.body),
  ])

    .then(([check, commentArr]) => {
      const commentObj = { comment: commentArr[0] };

      res.status(201).send(commentObj);
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticles = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then(() => {
      return updateArticle(article_id, req.body);
    })
    .then((mystery) => {
      console.log(mystery);
    })
    .catch((err) => {
      next(err);
    });
};
