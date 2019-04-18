import { Query, Resolver, Args } from "@nestjs/graphql";
import { Course } from "./course.entity";
import { CourseService } from "./course.service";
import { Arg, Int } from "type-graphql";

@Resolver("Course")
export class CourseResolver {
  constructor(private readonly courseService: CourseService) {}

  @Query(returns => [Course])
  async courses() {
    return this.courseService.courses();
  }

  @Query(returns => Course)
  async course(@Arg("id", type => Int) id: number) {
    return this.courseService.course(id);
  }
}
