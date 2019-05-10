import { Test, TestingModule } from "@nestjs/testing";
import { PrismaModule } from "../src/prisma/prisma.module";
import { PrismaService } from "../src/prisma/prisma.service";

describe("Course (e2e)", () => {
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule]
    }).compile();

    prisma = module.get(PrismaService);
  });

  it("should be defined", () => {
    expect(prisma).toBeDefined();
  });

  // TODO Write many more tests.
});
