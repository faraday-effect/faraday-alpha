import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UnitResolver } from "./syllabus.resolvers";
import { SyllabusService } from "./syllabus.service";
import { Topic, Unit } from "./entities";

@Module({
  imports: [TypeOrmModule.forFeature([Topic, Unit])],
  providers: [SyllabusService, UnitResolver]
})
export class SyllabusModule {}
