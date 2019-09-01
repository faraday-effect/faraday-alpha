import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
  Department,
  DepartmentCreateInput,
  Prefix,
  PrefixCreateInput
} from "./entities";
import { OrgService } from "./org.service";

@Resolver(of => Department)
export class DepartmentResolver {
  constructor(private readonly orgService: OrgService) {}

  @Mutation(returns => Department)
  createDepartment(@Args("createInput") createInput: DepartmentCreateInput) {
    return this.orgService.createDepartment(createInput);
  }

  @Query(returns => [Department])
  departments() {
    return this.orgService.readAll(Department);
  }
}

@Resolver(of => Prefix)
export class PrefixResolver {
  constructor(private readonly orgService: OrgService) {}

  @Mutation(returns => Prefix)
  createPrefix(@Args("createInput") createInput: PrefixCreateInput) {
    return this.orgService.createPrefix(createInput);
  }

  @Query(returns => [Prefix])
  prefixes() {
    return this.orgService.readAll(Prefix);
  }
}
