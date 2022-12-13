const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => seed(testData));

afterAll(() => {
  if (db.end) db.end();
});

describe("pathFindingError", () => {
  test("Should return 404 if path not found ", () => {
    return request(app)
      .get("/api/notapath")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("invalid endpoint path");
      });
  });
});

describe("Get api/topics", () => {
  test("Status 200: Should return with an array length of 3", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        console.log(body);
        expect(body.length).toBe(3);
      });
  });
  test("Should return with an array of object, all of which have a slug and description key  ", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
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
