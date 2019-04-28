// ----- HOLIDAYS -----

import { Field, Int, ObjectType, InputType } from "type-graphql";
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

  @Field(type => Term)
  term: Term;
}

export interface HolidayWhereUniqueInput {
  id?: number;
}

export interface HolidayWhereInput {
  id?: number;
  title?: string;
  startDate?: Date;
  endDate?: Date;
  term?: Term;
}

export interface HolidayUpdateInput {
  id?: number;
  title?: string;
  startDate?: Date;
  endDate?: Date;
  term?: Term;
}

export enum HolidayOrderByInput {
  idAsc,
  idDesc,
  titleAsc,
  titleDesc,
  startDateAsc,
  startDateDesc,
  endDateAsc,
  endDateDesc,
  termAsc,
  termDesc
}
