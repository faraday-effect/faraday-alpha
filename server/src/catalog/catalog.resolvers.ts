import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
  Course,
  CourseCreateInput,
  Section,
  SectionCreateInput
} from "./entities";
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

@Resolver(of => Section)
export class SectionResolver {
  constructor(private readonly catalogService: CatalogService) {}

  @Mutation(returns => Section)
  createSection(@Args("createInput") createInput: SectionCreateInput) {
    return this.catalogService.createSection(createInput);
  }

  @Query(returns => [Section])
  sections() {
    return this.catalogService.readAll(Section);
  }
}
