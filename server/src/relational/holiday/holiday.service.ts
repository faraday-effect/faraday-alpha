// ----- HOLIDAY SERVICE -----
// Generated 2019-04-27 19:12:17

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  Holiday,
  HolidayCreateInput,
  HolidayWhereUniqueInput,
  HolidayWhereInput,
  HolidayOrderByInput,
  HolidayUpdateInput
} from "./holiday.entity";

@Injectable()
export class HolidayService {
  constructor(
    @InjectRepository(Holiday)
    private readonly holidayRepository: Repository<Holiday>
  ) {}

  // Create
  async createHoliday(data: HolidayCreateInput) {
    const newHoliday = this.holidayRepository.create(data);
    return await this.holidayRepository.save(newHoliday);
  }

  async upsertHoliday(args: {
    where: HolidayWhereUniqueInput;
    create: HolidayCreateInput;
    update: HolidayUpdateInput;
  }) {}

  // Read
  async holiday(where: HolidayWhereUniqueInput) {
    return await this.holidayRepository.findOne(where);
  }

  async holidays(args?: {
    where?: HolidayWhereInput;
    orderBy?: HolidayOrderByInput;
    skip?: number;
    take?: number;
  }) {
    return await this.holidayRepository.find(args.where);
  }

  // Update
  async updateHoliday(args: {
    data: HolidayUpdateInput;
    where: HolidayWhereUniqueInput;
  }) {}

  async updateManyHolidays(args: {
    data: HolidayUpdateInput;
    where?: HolidayWhereInput;
  }) {}

  // Delete
  async deleteHoliday(where: HolidayWhereUniqueInput) {}

  async deleteManyHolidays(where?: HolidayWhereInput) {}
}
