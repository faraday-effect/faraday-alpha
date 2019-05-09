import { HttpServer, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import request from "supertest";
import { Repository } from "typeorm";
import { AppModule } from "../src/app.module";
import { Department } from "../src/relational/department/department.entity";
import { DepartmentService } from "../src/relational/department/department.service";

describe("Department (e2e)", () => {
  let module: TestingModule;
  let app: INestApplication;
  let httpServer: HttpServer;
  let newDepartments: Department[];

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = module.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    const deptNames = ["CS&E", "Physics", "English", "Music"];
    const deptService: DepartmentService = module.get(DepartmentService);
    const deptRepository: Repository<Department> = module.get(
      getRepositoryToken(Department)
    );

    // TODO - FIX ME to use db-helper function.
    // Clear relevant database content.
    await deptRepository.query("TRUNCATE TABLE departments CASCADE");

    // Seed database.
    newDepartments = await Promise.all(
      deptNames.map(name => deptService.create({ name }))
    );
  });

  it("can fetch all departments", async () => {
    return request(httpServer)
      .post("/graphql")
      .send({
        query: /* GraphQL */ `
          query allDepartments {
            departments {
              id
              name
            }
          }
        `
      })
      .expect(200)
      .then(response => {
        expect(response.body.data.departments).toHaveLength(4);
      });
  });

  it("can fetch each department", async () => {
    for (let newDept of newDepartments) {
      await request(httpServer)
        .post("/graphql")
        .send({
          query: /* GraphQL */ `
            query oneDept($deptId: Int!) {
              department(id: $deptId) {
                id
                name
              }
            }
          `,
          variables: { deptId: newDept.id }
        })
        .then(response => {
          const dept = response.body.data.department;
          expect(dept.id).toBe(newDept.id);
          expect(dept.name).toBe(newDept.name);
        })
        .catch(error => console.error("ERROR", error));
    }
  });

  it("can create a new department", async () => {
    const newDeptName = "Underwater Handicrafts";
    await request(httpServer)
      .post("/graphql")
      .send({
        query: /* GraphQL */ `
          mutation createOne($deptName: String!) {
            createDepartment(data: { name: $deptName }) {
              id
              name
            }
          }
        `,
        variables: { deptName: newDeptName }
      })
      .then(response => {
        expect(response.body.data.createDepartment.name).toBe(newDeptName);
      });
  });
});
