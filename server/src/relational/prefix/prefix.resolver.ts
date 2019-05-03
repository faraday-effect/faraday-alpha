import { Args, Query } from "@nestjs/graphql";
import { Mutation, Resolver } from "type-graphql";
import { Prefix, PrefixCreateInput } from "./prefix.entity";
import { PrefixService } from "./prefix.service";

@Resolver(Prefix)
export class PrefixResolver {
  constructor(private readonly prefixService: PrefixService) {}

  @Mutation(returns => Prefix)
  async createPrefix(@Args("data") data: PrefixCreateInput): Promise<Prefix> {
    return this.prefixService.create(data);
  }

  @Query(returns => [Prefix])
  async prefixes() {
    return this.prefixService.prefixes();
  }
}
