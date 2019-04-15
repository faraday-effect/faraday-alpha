import { Parent, Query, ResolveProperty, Resolver } from "@nestjs/graphql";
import { Arg, Int } from "type-graphql";
import { Course } from "../course/course.entity";
import { Department } from "./department.entity";
import { DepartmentService } from "./department.service";
import { CourseService } from "../course/course.service";

@Resolver(() => Department)
export class DepartmentResolver {
  constructor(
    private readonly departmentService: DepartmentService,
    private readonly courseService: CourseService
  ) {}

  @Query(returns => [Department], { description: "Return all departments" })
  async departments() {
    return this.departmentService.findAll();
  }

  @Query(returns => Department, { description: "Return department by ID" })
  async department(@Arg("id", type => Int) id: number) {
    return this.departmentService.findOne(id);
  }

  @ResolveProperty("courses", returns => [Course])
  async getCourses(@Parent() department: Department) {
    return this.courseService.find({ departmentId: department.id });

    // ***** THIS WORKS
    // return this.departmentService.coursesFor(department.id);

    // ***** THIS WORKS
    // const myCourse = new Course();
    // myCourse.id = 1;
    // myCourse.department = null;
    // myCourse.number = "ABC123";
    // myCourse.title = "Foo Barring";
    // return [myCourse];
  }
}
