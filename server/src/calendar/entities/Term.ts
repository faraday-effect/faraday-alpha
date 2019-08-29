import { Field, InputType, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany } from "typeorm";
import { DateRange, DateRangeCreateInput } from "./DateRange";
import { AbstractEntity } from "../../shared/abstract-entity";

@Entity()
@ObjectType()
export class Term extends AbstractEntity {
  @Column()
  @Field()
  name: string;

  @Column({ length: 10 })
  @Field()
  startDate: string;

  @Column({ length: 10 })
  @Field()
  endDate: string;

  @OneToMany(type => DateRange, dateRange => dateRange.term)
  @Field(type => [DateRange])
  dateRanges: DateRange[];
}

@InputType()
export class TermCreateInput {
  @Field() name: string;
  @Field() startDate: string;
  @Field() endDate: string;

  @Field(type => [DateRangeCreateInput], { nullable: true })
  dateRanges: DateRangeCreateInput[];
}
