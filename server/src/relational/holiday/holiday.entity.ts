// ----- HOLIDAYS -----
// Generated 2019-04-26 23:07:12

import { Field, Int, ObjectType, ArgsType, InputType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Term } from "../term/term.entity";

@Entity("holidays")
@ObjectType()
export class Holiday {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Column({ type: "varchar", length: 64 })
  @Field()
  title: string;

  @Column({ type: "date" })
  @Field()
  startDate: Date;

  @Column({ type: "date" })
  @Field()
  endDate: Date;

  @ManyToOne(type => Term, term => term.holidays)
  @Field(type => Term)
  term: Term;
}

@InputType()
export class HolidayCreateInput {
  @Field()
  title: string;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;
}

export interface HolidayWhereUniqueInput {
  id?: number;
}

export interface HolidayWhereInput {
  title?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface HolidayUpdateInput {
  title?: string;
  startDate?: Date;
  endDate?: Date;
}

export enum HolidayOrderByInput {
  titleAsc,
  titleDesc,
  startDateAsc,
  startDateDesc,
  endDateAsc,
  endDateDesc
}
