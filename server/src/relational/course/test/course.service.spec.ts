import { Test, TestingModule } from "@nestjs/testing";
import { CourseService } from "../course.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Department } from "../..//department/department.entity";
import { Course } from "../course.entity";

describe("CourseService", () => {
  let service: CourseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseService,
        {
          provide: getRepositoryToken(Department),
          useValue: {}
        },
        {
          provide: getRepositoryToken(Course),
          useValue: {}
        }
      ]
    }).compile();

    service = module.get<CourseService>(CourseService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
