import { Field, InputType, Int, ObjectType } from "type-graphql";
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  ValueTransformer
} from "typeorm";
import { DateRange } from "./DateRange";
import { DateTime } from "luxon";

const dateTransformer: ValueTransformer = {
  to: (entityValue: DateTime) => entityValue.toISODate(),
  from: (databaseValue: string) => DateTime.fromISO(databaseValue)
};

@Entity()
@ObjectType()
export class Term {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column({ length: 10 })
  @Field()
  startDate: string;

  @Column({ length: 10 })
  @Field()
  endDate: string;

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  @OneToMany(type => DateRange, dateRange => dateRange.term)
  @Field(type => [DateRange])
  dateRanges: DateRange[];
}

@InputType()
class ExplicitDateRange {
  @Field() title: string;
  @Field() startDate: string;
  @Field({ nullable: true }) endDate?: string;
}

@InputType()
export class TermCreateInput {
  @Field() name: string;
  @Field() startDate: string;
  @Field() endDate: string;

  @Field(type => [ExplicitDateRange], { nullable: true })
  dateRanges: ExplicitDateRange[];
}
