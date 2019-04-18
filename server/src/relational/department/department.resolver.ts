import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveProperty,
  Resolver
} from "@nestjs/graphql";
import { Arg, Int } from "type-graphql";
import { Course } from "../course/course.entity";
import { CourseService } from "../course/course.service";
import { Department } from "./department.entity";
import { DepartmentService } from "./department.service";

@Resolver(() => Department)
export class DepartmentResolver {
  constructor(
    private readonly departmentService: DepartmentService,
    private readonly courseService: CourseService
  ) {}

  @Query(returns => [Department])
  async departments() {
    return this.departmentService.departments();
  }

  @Query(returns => Department)
  async department(@Arg("id", type => Int) id: number) {
    return this.departmentService.department(id);
  }

  @Mutation(returns => Department)
  async create(@Args("name") name: string) {
    console.log("DEPT NAME", name);
    return this.departmentService.createDepartment({ name });
  }

  @ResolveProperty("courses", returns => [Course])
  async getCourses(@Parent() department: Department) {
    return this.courseService.courses({ department });
  }
}
