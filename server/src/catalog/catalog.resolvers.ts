import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Course, CourseCreateInput } from "./entities";
import { CatalogService } from "./catalog.service";

@Resolver(of => Course)
export class CourseResolver {
  constructor(private readonly catalogService: CatalogService) {}

  @Mutation(returns => Course)
  createCourse(@Args("createInput") createInput: CourseCreateInput) {
    return this.catalogService.createCourse(createInput);
  }

  @Query(returns => [Course])
  courses() {
    return this.catalogService.readAll(Course);
  }
}
