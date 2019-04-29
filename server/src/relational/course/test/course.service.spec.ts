import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Course } from "../course.entity";
import { CourseService } from "../course.service";

describe("CourseService", () => {
  let module: TestingModule;
  let courseService: CourseService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([Course])],
      providers: [CourseService]
    }).compile();

    courseService = module.get<CourseService>(CourseService);
  });

  afterAll(() => {
    return module.close();
  });

  it("should be defined", () => {
    expect(courseService).toBeDefined();
  });
});
