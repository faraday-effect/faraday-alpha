import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrgService } from "./org.service";
import { Department, Prefix } from "./entities";
import { DepartmentResolver, PrefixResolver } from "./org.resolvers";

@Module({
  imports: [TypeOrmModule.forFeature([Department, Prefix])],
  providers: [OrgService, DepartmentResolver, PrefixResolver]
})
export class OrgModule {}
