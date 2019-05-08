import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Department } from "../department.entity";
import { DepartmentService } from "../department.service";
import { ormConfig } from "../../../../orm.config";
import { truncateTable } from "../../../utils/db-helpers";
import { DepartmentModule } from "../department.module";

describe("DepartmentService", () => {
  let module: TestingModule;
  let deptService: DepartmentService;
  let deptRepository: Repository<Department>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(ormConfig), DepartmentModule]
    }).compile();

    deptService = module.get(DepartmentService);
    deptRepository = module.get(getRepositoryToken(Department));
  });

  afterAll(() => {
    return module.close();
  });

  beforeEach(async () => {
    return await truncateTable(deptRepository, "departments");
  });

  it("should be defined", () => {
    expect(deptService).toBeDefined();
  });

  async function _createNewDepartment(deptName: string) {
    const insertResult = await deptRepository.insert({ name: deptName });
    expect(insertResult).toHaveProperty("identifiers.0.id");
    return insertResult.identifiers[0].id;
  }

  it("can create a new department without courses", async () => {
    const name = "Department of Departments Department";
    await deptService.create({ name });

    const dept = await deptRepository.find({ name });
    expect(dept).toHaveLength(1);
    expect(dept[0]).toHaveProperty("name", name);
  });

  it("can fetch a department by `id`", async () => {
    const deptName = "Department of Departments Department";
    const newId: number = await _createNewDepartment(deptName);

    const readResult = await deptService.department({ id: newId });
    expect(readResult).toHaveProperty("name", deptName);
  });

  it("can fetch all departments", async () => {
    const howMany = 4;
    for (let i = 0; i < howMany; i++) {
      await _createNewDepartment(`Department #${i}`);
    }

    const readResult = await deptService.departments();
    expect(readResult).toHaveLength(howMany);
  });
});
