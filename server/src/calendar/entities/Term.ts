import { Field, InputType, Int, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DateRange } from "./DateRange";

@Entity()
@ObjectType()
export class Term {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Column() @Field() name: string;
  @Column() @Field() startDate: Date;
  @Column() @Field() endDate: Date;

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  @OneToMany(type => DateRange, dateRange => dateRange.term)
  @Field(type => [DateRange])
  dateRanges: DateRange[];
}

@InputType()
class ExplicitDateRange {
  @Field() title: string;
  @Field() startDate: Date;
  @Field({ nullable: true }) endDate?: Date;
}

@InputType()
export class TermCreateInput {
  @Field() name: string;
  @Field() startDate: Date;
  @Field() endDate: Date;

  @Field(type => [ExplicitDateRange], { nullable: true })
  dateRanges: ExplicitDateRange[];
}
