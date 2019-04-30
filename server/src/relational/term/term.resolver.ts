import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Term, TermCreateInput } from "./term.entity";
import { TermService } from "./term.service";
import { Int } from "type-graphql";

@Resolver(Term)
export class TermResolver {
  public constructor(private readonly termService: TermService) {}

  @Mutation(returns => Term)
  async createTerm(@Args("data") data: TermCreateInput) {
    return this.termService.createTerm(data);
  }

  @Query(returns => [Term])
  async terms() {
    return this.termService.terms();
  }

  @Query(returns => Term)
  async term(@Args({ name: "id", type: () => Int }) id: number) {
    return this.termService.term({ id });
  }
}
