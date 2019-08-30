import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TopicResolver, UnitResolver } from "./syllabus.resolvers";
import { SyllabusService } from "./syllabus.service";
import { Topic, Unit } from "./entities";

@Module({
  imports: [TypeOrmModule.forFeature([Topic, Unit])],
  providers: [SyllabusService, UnitResolver, TopicResolver]
})
export class SyllabusModule {}
