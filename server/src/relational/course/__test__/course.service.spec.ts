import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ormConfig } from "../../../../orm.config";
import { Course, CourseCreateInput } from "../course.entity";
import { CourseService } from "../course.service";
import { truncateTable } from "../../../utils/db-helpers";

describe("CourseService", () => {
  let module: TestingModule;
  let courseService: CourseService;
  let courseRepository: Repository<Course>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(ormConfig),
        TypeOrmModule.forFeature([Course])
      ],
      providers: [CourseService]
    }).compile();

    courseService = module.get<CourseService>(CourseService);
    courseRepository = module.get(getRepositoryToken(Course));
  });

  afterAll(() => {
    return module.close();
  });

  beforeEach(() => {
    return truncateTable(courseRepository, "courses");
  });

  it("should be defined", () => {
    expect(courseService).toBeDefined();
  });

  it("can create a new course", async () => {
    const courseInput: CourseCreateInput = {
      number: "COS 343",
      title: "Advanced Database Concepts"
    };

    const newCourse = await courseService.create(courseInput);
    expect(newCourse).toHaveProperty("number", courseInput.number);
    expect(newCourse).toHaveProperty("title", courseInput.title);
    expect(newCourse.id).toBeGreaterThan(0);

    const fetchedCourse = await courseRepository.findOne(newCourse.id);
    expect(fetchedCourse).toHaveProperty("number", courseInput.number);
  });
});
