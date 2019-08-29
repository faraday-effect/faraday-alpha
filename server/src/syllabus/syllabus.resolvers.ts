import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveProperty,
  Resolver
} from "@nestjs/graphql";
import { SyllabusService } from "./syllabus.service";
import { Topic, Unit, UnitCreateInput } from "./entities";

@Resolver(of => Unit)
export class UnitResolver {
  constructor(private readonly syllabusService: SyllabusService) {}

  @Mutation(returns => Unit)
  createUnit(@Args("createInput") createInput: UnitCreateInput) {
    return this.syllabusService.createUnit(createInput);
  }

  @Query(returns => [Unit])
  units() {
    return this.syllabusService.readAll(Unit);
  }

  @ResolveProperty("topics", type => [Topic])
  resolveTopics(@Parent() unit: Unit) {
    return this.syllabusService.find(Topic, { unit });
  }
}
