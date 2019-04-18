import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DepartmentModule } from "../../department/department.module";
import { Course } from "../course.entity";
import { CourseResolver } from "../course.resolver";
import { CourseService } from "../course.service";

describe("CourseResolver", () => {
  let resolver: CourseResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseResolver,
        CourseService,
        {
          provide: getRepositoryToken(Course),
          useValue: {}
        }
      ]
    }).compile();

    resolver = module.get<CourseResolver>(CourseResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
