import { Query, Resolver } from "@nestjs/graphql";
import { Arg, Int } from "type-graphql";
import { Course } from "./course.entity";
import { CourseService } from "./course.service";

@Resolver("Course")
export class CourseResolver {
  constructor(private readonly courseService: CourseService) {}

  @Query(() => [Course])
  async courses() {
    return this.courseService.courses();
  }

  @Query(() => Course)
  async course(@Arg("id", () => Int) id: number) {
    return this.courseService.course({ id });
  }
}
