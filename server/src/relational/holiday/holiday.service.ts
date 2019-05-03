// ----- HOLIDAY SERVICE -----

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
  async create(data: HolidayCreateInput) {
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
    if (args) {
      return await this.holidayRepository.find(args.where);
    } else {
      return await this.holidayRepository.find();
    }
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
