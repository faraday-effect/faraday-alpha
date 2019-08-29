import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveProperty,
  Resolver
} from "@nestjs/graphql";
import { CalendarService } from "./calendar.service";
import { Int } from "type-graphql";
import { DateRange, Term, TermCreateInput } from "./entities";

@Resolver(of => Term)
export class TermResolver {
  constructor(private readonly calendarService: CalendarService) {}

  @Mutation(returns => Term)
  createTerm(@Args("createInput") createInput: TermCreateInput) {
    return this.calendarService.createTerm(createInput);
  }

  @Query(returns => Term)
  term(@Args({ name: "id", type: () => Int }) id: number) {
    return this.calendarService.readOne(Term, id);
  }

  @Query(returns => [Term])
  terms() {
    return this.calendarService.readAll(Term);
  }

  @ResolveProperty("dateRanges", type => [DateRange])
  resolveDateRanges(@Parent() term: Term) {
    return this.calendarService.find(DateRange, { term });
  }
}
