import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Department, DepartmentCreateInput } from "./department.entity";
import { DepartmentService } from "./department.service";

@Resolver("Department")
export class DepartmentResolver {
  constructor(private readonly departmentService: DepartmentService) {}

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

  // @ResolveProperty("courses", returns => [Course])
  // async getCourses(@Parent() department: Department) {
  //   return this.courseService.courses({ where: { department } });
  // }
}
