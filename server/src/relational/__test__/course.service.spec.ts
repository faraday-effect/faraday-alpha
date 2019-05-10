import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { truncateTable } from "../../../utils/db-helpers";
import { Department, DepartmentCreateInput } from "../../department/department.entity";
import { DepartmentModule } from "../../department/department.module";
import { Prefix, PrefixCreateInput } from "../../prefix/prefix.entity";
import { PrefixModule } from "../../prefix/prefix.module";
import { Course, CourseCreateInput } from "../course.entity";
import { CourseModule } from "../course.module";

function _createDepartment(departmentRepository: Repository<Department>) {
  const data: DepartmentCreateInput = { name: "Underwater Handicrafts" };
  return departmentRepository.save(departmentRepository.create(data));
}

function _createPrefix(prefixRepository: Repository<Prefix>) {
  const data: PrefixCreateInput = { value: "UWH" };
  return prefixRepository.save(prefixRepository.create(data));
}

describe("CourseService", () => {
  let module: TestingModule;
  let courseService: CourseService;
  let courseRepository: Repository<Course>;
  let departmentRepository: Repository<Department>;
  let prefixRepository: Repository<Prefix>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [CourseModule, DepartmentModule, PrefixModule]
    }).compile();

    courseService = module.get<CourseService>(CourseService);
    courseRepository = module.get(getRepositoryToken(Course));
    departmentRepository = module.get(getRepositoryToken(Department));
    prefixRepository = module.get(getRepositoryToken(Prefix));
  });

  afterAll(() => module.close());

  beforeEach(() => truncateTable(courseRepository, "courses"));

  it("should be defined", () => {
    expect(courseService).toBeDefined();
  });

  describe("when creating a wcourse", () => {
    it("checks for missing department", async () => {
      const newPrefix = await _createPrefix(prefixRepository);

      // Create a new department and then delete it immediately,
      // ensuring that it will not exist for the test.
      const doomedDepartment = await _createDepartment(departmentRepository);
      await departmentRepository.delete(doomedDepartment.id);

      const courseInput: CourseCreateInput = {
        number: "UWH 101",
        title: "Introduction to Underwater Basket Weaving",
        departmentId: doomedDepartment.id,
        prefixId: newPrefix.id
      };

      await expect(courseService.create(courseInput)).rejects.toThrow();
    });

    it("checks for missing prefix", async () => {
      const newDepartment = await _createDepartment(departmentRepository);

      // Create a new prefix and then delete it immediately,
      // ensuring that it will not exist for the test.
      const newPrefix = await _createPrefix(prefixRepository);
      await prefixRepository.delete(newPrefix.id);

      const courseInput: CourseCreateInput = {
        number: "UWH 101",
        title: "Introduction to Underwater Basket Weaving",
        departmentId: newDepartment.id,
        prefixId: newPrefix.id
      };

      await expect(courseService.create(courseInput)).rejects.toThrow();
    });

    it("works with valid department and prefix", async () => {
      const newDepartment: Department = await _createDepartment(
        departmentRepository
      );
      const newPrefix = await _createPrefix(prefixRepository);

      // WHEN creating a course in that department.
      const courseInput: CourseCreateInput = {
        number: "UWH 433",
        title: "Underwater Basket Weaving Practicum",
        departmentId: newDepartment.id,
        prefixId: newPrefix.id
      };

      const newCourse = await courseService.create(courseInput);

      // AND fetching it back from the database.
      const fetchedCourse = await courseRepository.findOne(newCourse.id, {
        relations: ["department", "prefix"]
      });

      // THEN the course is correct
      expect(fetchedCourse).toHaveProperty("number", courseInput.number);
      expect(fetchedCourse).toHaveProperty("title", courseInput.title);

      // AND is associated with the department and a prefix
      expect(fetchedCourse).toHaveProperty(
        "department.name",
        newDepartment.name
      );
      expect(fetchedCourse).toHaveProperty("prefix.value", newPrefix.value);
    });
  });
});
