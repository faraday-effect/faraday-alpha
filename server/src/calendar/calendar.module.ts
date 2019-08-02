import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Calendar } from "./entities/calendar";
import { CalendarResolver } from "./calendar.resolvers";
import { CalendarService } from "./calendar.service";
import { DateRange } from "./entities/DateRange";
import { Term } from "./entities/Term";

@Module({
  imports: [TypeOrmModule.forFeature([Calendar, Term, DateRange])],
  providers: [CalendarService, CalendarResolver]
})
export class CalendarModule {}
