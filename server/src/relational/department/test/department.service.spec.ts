import { Test, TestingModule } from "@nestjs/testing";
import { DepartmentService } from "../department.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Department } from "../department.entity";

describe("DepartmentService", () => {
  let service: DepartmentService;

  const mockRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentService,
        {
          provide: getRepositoryToken(Department),
          useValue: mockRepository
        }
      ]
    }).compile();

    service = module.get<DepartmentService>(DepartmentService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
