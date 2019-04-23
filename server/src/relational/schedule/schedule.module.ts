import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Holiday } from "./holiday.entity";
import { Term } from "./term.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Holiday, Term])]
})
export class ScheduleModule {}
