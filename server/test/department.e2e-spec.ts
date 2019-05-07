import { INestApplication, HttpServer } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../src/app.module";
import { DepartmentService } from "../src/relational/department/department.service";
import { Department } from "../src/relational/department/department.entity";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("Department (e2e)", () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let deptService: DepartmentService;
  let deptRepository: Repository<Department>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = module.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer();

    deptService = module.get(DepartmentService);
    deptRepository = module.get(getRepositoryToken(Department));
  });

  afterAll(async () => {
    app.close();
  });

  beforeEach(() => {
    deptRepository.query("TRUNCATE TABLE departments CASCADE");
  });

  it("can fetch all departments", async () => {
    const deptNames = ["CS&E", "Physics", "English", "Music"];
    for (let name of deptNames) {
      await deptService.create({ name });
    }

    return request(httpServer)
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
