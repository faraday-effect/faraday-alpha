import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveProperty,
  Resolver
} from "@nestjs/graphql";
import { CourseService } from "../course/course.service";
import { Department, DepartmentCreateInput } from "./department.entity";
import { DepartmentService } from "./department.service";
import { Course } from "../course/course.entity";

@Resolver((of: any) => Department)
export class DepartmentResolver {
  constructor(
    private readonly departmentService: DepartmentService,
    private readonly courseService: CourseService
  ) {}

  @Mutation(returns => Department)
  async createDepartment(@Args("data") data: DepartmentCreateInput) {
    return this.departmentService.createDepartment(data);
  }

  @Query(returns => [Department])
  async departments() {
    return this.departmentService.departments();
  }

  @Query(returns => Department)
  async department(@Args("id") id: number) {
    return this.departmentService.department({ id });
  }

  @ResolveProperty("courses", returns => [Course])
  async getDepartmentCourses(
    @Parent() department: Department
  ): Promise<Course[]> {
    return this.courseService.courses({ where: { department } });
  }
}
