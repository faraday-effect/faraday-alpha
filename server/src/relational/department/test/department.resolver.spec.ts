import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Course } from "../../course/course.entity";
import { CourseModule } from "../../course/course.module";
import { CourseService } from "../../course/course.service";
import { Department } from "../department.entity";
import { DepartmentResolver } from "../department.resolver";
import { DepartmentService } from "../department.service";

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
});