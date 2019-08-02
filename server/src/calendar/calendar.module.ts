import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Calendar } from "./calendar.entities";
import { CalendarResolver } from "./calendar.resolvers";
import { CalendarService } from "./calendar.service";

@Module({
  imports: [TypeOrmModule.forFeature([Calendar])],
  providers: [CalendarService, CalendarResolver]
})
export class CalendarModule {}
