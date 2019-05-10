import { HttpServer, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../src/app.module";
import { Department } from "../src/generated/prisma-client";
import { PrismaModule } from "../src/prisma/prisma.module";
import { PrismaService } from "../src/prisma/prisma.service";

describe("Department (e2e)", () => {
  let module: TestingModule;
  let app: INestApplication;
  let httpServer: HttpServer;
  let newDepartments: Department[];
  let prisma: PrismaService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule, PrismaModule]
    }).compile();

    app = module.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer();

    prisma = module.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    const deptNames = ["CS&E", "Physics", "English", "Music"];

    await prisma.client.deleteManySections();
    await prisma.client.deleteManyCourses();
    await prisma.client.deleteManyDepartments();

    newDepartments = await Promise.all(
      deptNames.map(name => prisma.client.createDepartment({ name }))
    );
  });

  it("can fetch all departments", async () => {
    expect.assertions(1);

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
    expect.assertions(2 * newDepartments.length);

    for (let newDept of newDepartments) {
      await request(httpServer)
        .post("/graphql")
        .send({
          query: /* GraphQL */ `
            query oneDepartment($deptId: Int) {
              department(where: { id: $deptId }) {
                id
                name
              }
            }
          `,
          variables: { deptId: newDept.id }
        })
        .expect(200)
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
