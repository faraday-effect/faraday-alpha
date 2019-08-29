import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TermResolver } from "./calendar.resolvers";
import { CalendarService } from "./calendar.service";
import { DateRange, Term } from "./entities";

@Module({
  imports: [TypeOrmModule.forFeature([Term, DateRange])],
  providers: [CalendarService, TermResolver]
})
export class CalendarModule {}
