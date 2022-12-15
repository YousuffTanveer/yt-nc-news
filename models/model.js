const db = require("../db/connection");

exports.selectTopics = () => {
  let baseQuery = `
    SELECT * FROM topics
    `;
  return db.query(baseQuery).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticles = (sort_by = "created_at", order = "DESC") => {
  const sortBy = ["author", "title", "topic", "created_at", "votes"];

  if (!sortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  let queryString = `
  SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, 
  COUNT(comment_id)::int AS comment_count
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id
  `;

  queryString += `ORDER BY ${sort_by} ${order};`;

  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticlesById = (id) => {
  let queryString = ` 
  SELECT * FROM articles WHERE article_id = $1`;

  return db.query(queryString, [id]).then(({ rows }) => {
    console.log(rows);
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "article not found" });
    }
    if (!rows) {
      return Promise.reject({ status: 400, msg: "invalid id" });
    } else {
      return rows;
    }
  });
};
