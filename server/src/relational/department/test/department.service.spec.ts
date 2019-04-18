import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Department } from "../department.entity";
import { DepartmentService } from "../department.service";

describe("DepartmentService", () => {
  let module: TestingModule;
  let deptService: DepartmentService;
  let deptRepo: Repository<Department>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(),
        TypeOrmModule.forFeature([Department])
      ],
      providers: [DepartmentService]
    }).compile();

    deptService = module.get<DepartmentService>(DepartmentService);
    deptRepo = module.get<Repository<Department>>(
      getRepositoryToken(Department)
    );
  });

  beforeEach(() => {
    return deptRepo.query("TRUNCATE TABLE departments CASCADE");
  });

  afterAll(() => {
    return module.close();
  });

  it("should be defined", () => {
    expect(deptService).toBeDefined();
  });

  async function _createNewDepartment(deptName: string) {
    const insertResult = await deptRepo.insert({ name: deptName });
    expect(insertResult).toHaveProperty("identifiers.0.id");
    return insertResult.identifiers[0].id;
  }

  it("can create a new department without courses", async () => {
    const name = "Department of Departments Department";
    await deptService.createDepartment({ name });

    const dept = await deptRepo.find({ name });
    expect(dept).toHaveLength(1);
    expect(dept[0]).toHaveProperty("name", name);
  });

  it("can fetch a department by `id`", async () => {
    const deptName = "Department of Departments Department";
    const newId: number = await _createNewDepartment(deptName);

    const readResult = await deptService.department(newId);
    expect(readResult).toHaveProperty("name", deptName);
  });

  it("can fetch all departments", async () => {
    const howMany = 4;
    for (let i = 0; i < howMany; i++) {
      const id = await _createNewDepartment(`Department #${i}`);
    }

    const readResult = await deptService.departments();
    expect(readResult).toHaveLength(howMany);
  });
});
