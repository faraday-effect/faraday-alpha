import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveProperty,
  Resolver
} from "@nestjs/graphql";
import {
  Course,
  CourseCreateInput,
  Section,
  SectionCreateInput
} from "./entities";
import { CatalogService } from "./catalog.service";
import { Term } from "src/calendar/entities/Term";
import { Department } from "../org/entities";

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

  @ResolveProperty("department", type => Department)
  resolveDepartment(@Parent() course: Course) {
    return this.catalogService.findOneOrFail(Department, course.departmentId);
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

  @Query(returns => Section)
  section(id: number) {
    return this.catalogService.readOne(Section, id);
  }

  @ResolveProperty("term", type => Term)
  resolveTerm(@Parent() section: Section) {
    return this.catalogService.findOneOrFail(Term, section.termId);
  }

  @ResolveProperty("course", type => Course)
  resolveCourse(@Parent() section: Section) {
    return this.catalogService.findOneOrFail(Course, section.courseId);
  }
}
