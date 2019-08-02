import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Calendar, CalendarUpdateInput } from "./calendar.entities";
import { CalendarService } from "./calendar.service";
import { Int } from "type-graphql";
import { DeleteResult } from "typeorm";

@Resolver(of => Calendar)
export class CalendarResolver {
  constructor(private readonly calendarService: CalendarService) {}

  @Mutation(returns => Calendar)
  async createCalendar(@Args("name") name: string) {
    return await this.calendarService.createCalendar(name);
  }

  @Query(returns => [Calendar])
  async calendars() {
    return await this.calendarService.calendars();
  }

  @Query(returns => Calendar)
  async calendar(@Args({ name: "id", type: () => Int }) id: number) {
    return await this.calendarService.calendar(id);
  }

  @Mutation(returns => Calendar)
  async updateCalendar(@Args("calendarData") calendarData: CalendarUpdateInput) {
    return await this.calendarService.updateCalendar(calendarData);
  }

  @Mutation(returns => Int)
  async deleteCalendar(@Args({ name: "id", type: () => Int }) id: number) {
    const result: DeleteResult = await this.calendarService.deleteCalendar(id);
    return result.affected;
  }
}
