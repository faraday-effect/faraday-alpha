import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CatalogService } from "./catalog.service";
import { Course, Offering } from "./entities";
import { CourseResolver } from "./catalog.resolvers";

@Module({
  imports: [TypeOrmModule.forFeature([Course, Offering])],
  providers: [CatalogService, CourseResolver]
})
export class CatalogModule {}
