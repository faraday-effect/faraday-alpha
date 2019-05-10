import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ormConfig } from "../orm.config";
import { CourseModule } from "../src/relational/course/course.module";
import { CourseResolver } from "../src/relational/course/course.resolver";

describe("Course (e2e)", () => {
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

  // TODO Write many more tests.
});
