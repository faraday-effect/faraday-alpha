import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Term } from "./term.entity";
import { TermResolver } from "./term.resolver";
import { TermService } from "./term.service";

@Module({
  imports: [TypeOrmModule.forFeature([Term])],
  providers: [TermResolver, TermService]
})
export class TermModule {}
