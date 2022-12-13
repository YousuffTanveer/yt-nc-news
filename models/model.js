const db = require("../db/connection");

exports.selectTopics = () => {
  let baseQuery = `
    SELECT * FROM topics
    `;
  return db.query(baseQuery).then(({ rows }) => {
    return rows;
  });
};
