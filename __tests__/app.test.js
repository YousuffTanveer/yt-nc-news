const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

require("jest-sorted");

beforeEach(() => seed(testData));

afterAll(() => {
  if (db.end) db.end();
});

describe("pathFindingError", () => {
  test("Should return 404 if path not found ", () => {
    return (
      request(app)
        // should .get be .all
        .get("/api/notapath")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("invalid endpoint path");
        })
    );
  });
});

describe("Get api/topics", () => {
  test("Should 200: respond with an array with a length of 3 with of object, all of which have a slug and description key  ", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(3);
        const topicsArr = body;
        topicsArr.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("Get api/articles", () => {
  test("Should 200: respond with an array of objects sorted in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(12);
        expect(body).toBeSortedBy("created_at", { descending: true });
        const articlesArr = body;
        articlesArr.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              article_id: expect.any(Number),
              comment_count: expect.any(Number),
              votes: expect.any(Number),
            })
          );
        });
      });
  });
});

describe("Get api/articles/:id", () => {
  test("Should 200: respond with a single article object", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          author: "icellusedkars",
          title: "Eight pug gifs that remind me of mitch",
          article_id: 3,
          body: "some gifs",
          topic: "mitch",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 0,
        });
      });
  });
  test("Should 404: respond with an error msg of id not found when id does not exist yet", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article not found");
      });
  });
  test("Should 400: respond with an error msg of id invalid if id cannot not exist", () => {
    return request(app)
      .get("/api/articles/Orange")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid id");
      });
  });
});

describe("Get api/articles/:id/comments", () => {
  test("Should 200: respond with an array of comments", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        const commentsArr = body.comments;
        commentsArr.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              article_id: 3,
              comment_id: expect.any(Number),
              created_at: expect.any(String),
              votes: expect.any(Number),
              body: expect.any(String),
              author: expect.any(String),
            })
          );
        });
      });
  });
  test("Should 200: respond with an empty array when passed an article with 0 comments", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then(({ body }) => {
        const commentsArr = body.comments;
        expect(commentsArr).toEqual([]);
      });
  });
  test("Should 404: respond with an error msg of id not found when id does not exist yet", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article not found");
      });
  });
  test("Should 400: respond with an error msg of id invalid if id cannot not exist", () => {
    return request(app)
      .get("/api/articles/Orange/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid id");
      });
  });
});
