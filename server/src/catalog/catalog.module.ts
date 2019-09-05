import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CatalogService } from "./catalog.service";
import { Course, Offering, Section } from "./entities";
import {
  CourseResolver,
  OfferingResolver,
  SectionResolver
} from "./catalog.resolvers";

@Module({
  imports: [TypeOrmModule.forFeature([Course, Offering, Section])],
  providers: [CatalogService, CourseResolver, SectionResolver, OfferingResolver]
})
export class CatalogModule {}
