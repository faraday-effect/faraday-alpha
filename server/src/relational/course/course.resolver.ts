import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Int } from "type-graphql";
import { Course, CourseCreateInput } from "./course.entity";
import { CourseService } from "./course.service";

@Resolver("Course")
export class CourseResolver {
  constructor(private readonly courseService: CourseService) {}

  @Mutation(returns => Course)
  async createCourse(@Args("data") data: CourseCreateInput): Promise<Course> {
    return this.courseService.create(data);
  }

  @Query(returns => [Course])
  async courses() {
    return this.courseService.courses();
  }

  @Query(returns => Course)
  async course(@Args({ name: "id", type: () => Int }) id: number) {
    return this.courseService.course({ id });
  }
}
