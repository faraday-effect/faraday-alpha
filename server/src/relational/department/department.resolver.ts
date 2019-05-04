import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveProperty,
  Resolver
} from "@nestjs/graphql";
import { Int } from "type-graphql";
import { Course } from "../course/course.entity";
import { CourseService } from "../course/course.service";
import { Department, DepartmentCreateInput } from "./department.entity";
import { DepartmentService } from "./department.service";

@Resolver(of => Department)
export class DepartmentResolver {
  constructor(
    private readonly departmentService: DepartmentService,
    private readonly courseService: CourseService
  ) {}

  @Mutation(returns => Department)
  async createDepartment(
    @Args("data") data: DepartmentCreateInput
  ): Promise<Department> {
    return this.departmentService.create(data);
  }

  @Query(returns => [Department], { name: "departments" })
  async getDepartments(): Promise<Department[]> {
    return this.departmentService.departments();
  }

  @Query(returns => Department)
  async department(
    @Args({ name: "id", type: () => Int }) id: number
  ): Promise<Department | undefined> {
    return this.departmentService.department({ id });
  }

  // Arguments to ResolveProperty:
  //   propertyName:
  //   typeFunc: type returned by this resolver
  //   options: nullable, defaultValue,
  //            description, deprecationReason,
  //            name -- type Schema Name
  //
  // @Field        functionName  propertyName  schemaName    Resolver      SDL
  // --            courses       --            --            courses       courses
  // --            courses       --            courses       courses       courses
  // --            courses       courses       --            courses       courses
  // --            courses       courses       courses       courses       courses
  // --            getCourses    --            --            getCourses    getCourses
  // --            getCourses    --            courses       courses       courses
  // --            getCourses    courses       --            getCourses    getCourses
  // --            getCourses    courses       courses       courses       courses
  // --            getCourses    --            getCourses    getCourses    getCourses
  // --            getCourses    courses       getCourses    getCourses    getCourses

  // courses       courses       --            --                          courses
  // courses       courses       --            courses                     courses
  // courses       courses       courses       --                          courses
  // courses       courses       courses       courses                     courses
  // courses       getCourses    --            --                          courses, getCourses
  // courses       getCourses    --            courses                     Error: Department.getCourses defined in resolvers, but not in schema
  // courses       getCourses    courses       --                          courses, getCourses
  // courses       getCourses    courses       courses                     courses

  // --            alpha         --            --                          alpha
  // --            alpha         --            gamma                       Error: Department.alpha defined in resolvers, but not in schema
  // --            alpha         beta          --                          Error: Department.beta defined in resolvers, but not in schema
  // --            alpha         beta          beta                        beta
  // --            alpha         beta          gamma                       Error: Department.beta defined in resolvers, but not in schema

  // courses       alpha         --            --                          courses, alpha
  // courses       alpha         --            gamma                       Error: Department.alpha defined in resolvers, but not in schema
  // courses       alpha         beta          --                          Error: Department.beta defined in resolvers, but not in schema
  // courses       alpha         beta          beta                        courses, beta
  // courses       alpha         beta          gamma                       Error: Department.beta defined in resolvers, but not in schema

  // From the TypeGraphQL documentation:
  //   > Note that if a field of an object type is purely calculable
  //   > (e.g. averageRating from ratings array) and we don't want to pollute the class signature,
  //   > we can omit it and just implement the field resolver (described in resolvers doc).

  @ResolveProperty()
  async courses(@Parent() department: Department) {
    return this.courseService.courses({ where: { department } });
  }
}
