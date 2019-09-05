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
  Offering,
  Section,
  SectionCreateInput
} from "./entities";
import { CatalogService } from "./catalog.service";
import { Department } from "../org/entities";
import { Term } from "../calendar/entities";

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

  @ResolveProperty("offerings", type => [Offering])
  resolveOfferings(@Parent() course: Course) {
    return this.catalogService.find(Offering, { course });
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

  @ResolveProperty("offering", type => Offering)
  resolveOffering(@Parent() section: Section) {
    return this.catalogService.findOneOrFail(Offering, section.offeringId);
  }
}
