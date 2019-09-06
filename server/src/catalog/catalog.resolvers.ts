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
import { Department, Prefix } from "../org/entities";
import { Term } from "../calendar/entities";
import { Unit } from "../syllabus/entities";
import { Int } from "type-graphql";

@Resolver(of => Course)
export class CourseResolver {
  constructor(private readonly catalogService: CatalogService) {}

  @Mutation(returns => Course)
  createCourse(@Args("createInput") createInput: CourseCreateInput) {
    return this.catalogService.createCourse(createInput);
  }

  @Query(returns => Course)
  course(@Args({ name: "id", type: () => Int }) id: number) {
    return this.catalogService.readOne(Course, id);
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

  @ResolveProperty("prefix", type => Prefix)
  resolvePrefix(@Parent() course: Course) {
    return this.catalogService.findOneOrFail(Prefix, course.prefixId);
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
  section(@Args({ name: "id", type: () => Int }) id: number) {
    return this.catalogService.readOne(Section, id);
  }

  @ResolveProperty("offering", type => Offering)
  resolveOffering(@Parent() section: Section) {
    return this.catalogService.findOneOrFail(Offering, section.offeringId);
  }
}

@Resolver(of => Offering)
export class OfferingResolver {
  constructor(private readonly catalogService: CatalogService) {}

  @Query(returns => Offering)
  offering(@Args({ name: "id", type: () => Int }) id: number) {
    return this.catalogService.readOne(Offering, id);
  }

  @Query(returns => [Offering])
  offerings() {
    return this.catalogService.readAll(Offering);
  }

  @ResolveProperty("units", type => [Unit])
  resolveUnits(@Parent() offering: Offering) {
    return this.catalogService.find(Unit, { offering });
  }

  @ResolveProperty("sections", type => [Section])
  resolveSections(@Parent() offering: Offering) {
    console.log("OFFERING", offering);
    return this.catalogService.find(Section, { offering });
  }

  @ResolveProperty("term", type => Term)
  resolveTerm(@Parent() offering: Offering) {
    return this.catalogService.findOneOrFail(Term, offering.termId);
  }

  @ResolveProperty("course", type => Course)
  resolveCourse(@Parent() offering: Offering) {
    return this.catalogService.findOneOrFail(Course, offering.courseId);
  }
}
