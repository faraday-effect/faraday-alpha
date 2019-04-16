import { Test, TestingModule } from "@nestjs/testing";
import { CourseController } from "../course.controller";
import { Course } from "../course.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CourseService } from "../course.service";
import { Department } from "../..//department/department.entity";

describe("Course Controller", () => {
  let controller: CourseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseController],
      providers: [
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

    controller = module.get<CourseController>(CourseController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
