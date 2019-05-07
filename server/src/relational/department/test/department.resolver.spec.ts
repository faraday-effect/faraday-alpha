import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../../../app.module";

describe("DepartmentResolver", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    app.close();
  });

  it("should be defined", () => {
    expect(app).toBeDefined();
  });

  it("can be pinged", () => {
    return request(app.getHttpServer())
      .get("/telemetry/ping")
      .expect(200)
      .then(response => {
        expect(response.body).toHaveProperty("ping", "pong");
        expect(response.body).toHaveProperty("platform");
      });
  });

  it("can fetch all departments", () => {
    return request(app.getHttpServer())
      .post("/graphql")
      .send({
        query: /* GraphQL */ `
          query simpleQuery {
            departments {
              id
              name
            }
          }
        `
      })
      .expect(200)
      .then(response => expect(response.body.data.departments).toHaveLength(4));
  });
});
