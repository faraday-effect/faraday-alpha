import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ormConfig } from "../../../../orm.config";
import { truncateTable } from "../../../utils/db-helpers";
import { Department } from "../../department/department.entity";
import { DepartmentModule } from "../../department/department.module";
import { Course, CourseCreateInput } from "../course.entity";
import { CourseModule } from "../course.module";
import { CourseService } from "../course.service";

describe("CourseService", () => {
  let module: TestingModule;
  let courseService: CourseService;
  let courseRepository: Repository<Course>;
  let departmentRepository: Repository<Department>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(ormConfig),
        CourseModule,
        DepartmentModule
      ]
    }).compile();

    courseService = module.get<CourseService>(CourseService);
    courseRepository = module.get(getRepositoryToken(Course));
    departmentRepository = module.get(getRepositoryToken(Department));
  });

  afterAll(() => {
    return module.close();
  });

  beforeEach(async () => {
    return await truncateTable(courseRepository, "courses");
  });

  it("should be defined", () => {
    expect(courseService).toBeDefined();
  });

  it("can create a new course without a department", async () => {
    // WHEN adding a course with no department
    const courseInput: CourseCreateInput = {
      number: "UWH 101",
      title: "Introduction to Underwater Basket Weaving"
    };
    const newCourse = await courseService.create(courseInput);

    // AND fetching back the course and related entities
    const fetchedCourse = await courseRepository.findOne(newCourse.id, {
      relations: ["department"]
    });
    if (!fetchedCourse) {
      throw Error(`Failed to fetch course '${newCourse.id}'`);
    }

    // THEN the new course should exist
    expect(fetchedCourse).toHaveProperty("number", courseInput.number);
    expect(fetchedCourse).toHaveProperty("title", courseInput.title);
    expect(fetchedCourse.id).toBeGreaterThan(0);
    // AND not have a department
    expect(fetchedCourse.department).toBeNull();
  });

  it("can create a new course with a department", async () => {
    // GIVEN an existing department
    const newDepartment = await departmentRepository.save(
      departmentRepository.create({ name: "Underwater Handicrafts" })
    );

    // WHEN adding a new course in that department
    const courseInput: CourseCreateInput = {
      number: "UWH 433",
      title: "Underwater Basket Weaving Practicum",
      departmentId: newDepartment.id
    };
    const newCourse = await courseService.create(courseInput);

    // AND fetching back the course and related entities
    const fetchedCourse = await courseRepository.findOne(newCourse.id, {
      relations: ["department"]
    });

    // THEN the new course should exist
    expect(fetchedCourse).toHaveProperty("number", courseInput.number);
    expect(fetchedCourse).toHaveProperty("title", courseInput.title);
    // AND be associated with the department
    expect(fetchedCourse).toHaveProperty("department.id", newDepartment.id);
  });
});
