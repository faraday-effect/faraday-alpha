import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TermResolver } from "./calendar.resolvers";
import { DateRange, Term } from "./entities";
import { CalendarService } from "./calendar.service";

@Module({
  imports: [TypeOrmModule.forFeature([Term, DateRange])],
  providers: [CalendarService, TermResolver]
})
export class CalendarModule {}
