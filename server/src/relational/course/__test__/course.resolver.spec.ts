import { Test, TestingModule } from "@nestjs/testing";
import { CourseModule } from "../course.module";
import { CourseResolver } from "../course.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ormConfig } from "../../../../orm.config";

describe("CourseResolver", () => {
  let resolver: CourseResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(ormConfig), CourseModule]
    }).compile();

    resolver = module.get(CourseResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
