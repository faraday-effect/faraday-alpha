import { Test, TestingModule } from "@nestjs/testing";
import { CourseResolver } from "../course.resolver";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Course } from "../course.entity";
import { CourseService } from "../course.service";
import { Department } from "../../department/department.entity";

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
        },
        {
          provide: getRepositoryToken(Department),
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
