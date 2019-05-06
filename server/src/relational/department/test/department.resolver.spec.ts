import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Course } from "../../course/course.entity";
import { CourseService } from "../../course/course.service";
import { Department } from "../department.entity";
import { DepartmentResolver } from "../department.resolver";
import { DepartmentService } from "../department.service";
import { gqlCall } from "../../../utils/gql-call";

describe("DepartmentResolver", () => {
  let resolver: DepartmentResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentResolver,
        DepartmentService,
        CourseService,
        {
          provide: getRepositoryToken(Course),
          useValue: {}
        },
        {
          provide: getRepositoryToken(Department),
          useValue: {}
        }
      ]
    }).compile();

    resolver = module.get<DepartmentResolver>(DepartmentResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });

  const allDeptsQuery = `query simplerDepts {
    departments {
      id
      name
    }
  }`;

  it("can fetch all departments", async () => {
    const response = await gqlCall({
      source: allDeptsQuery
    });
    console.log("RESPONSE", JSON.stringify(response, null, 2));
    expect(response.data).toBeTruthy();
  });
});
