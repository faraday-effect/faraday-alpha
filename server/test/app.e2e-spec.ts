import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "./../src/app.module";
import { INestApplication, HttpServer } from "@nestjs/common";

describe("AppController (e2e)", () => {
  let app: INestApplication;
  let mockServer: HttpServer;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = module.createNestApplication();
    await app.init();
    mockServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  it("passes the sanity test", () => {
    return request(mockServer)
      .get("/")
      .expect(200)
      .expect("Faraday server is running");
  });

  it("can ping successfully", async () => {
    const response = await request(mockServer).get("/telemetry/ping");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("ping", "pong");
  });
});
