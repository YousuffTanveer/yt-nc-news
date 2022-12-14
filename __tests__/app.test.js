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
  test("Should return with an array with a length of 3 with of object, all of which have a slug and description key  ", () => {
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

describe("get articles", () => {
  test("Should 200: return with an array of objects sorted in descending order", () => {
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
