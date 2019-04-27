// ----- TERMS -----
// Generated 2019-04-26 23:07:12

import { Field, Int, ObjectType, ArgsType, InputType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Holiday } from "../holiday/holiday.entity";
import { Section } from "../section/section.entity";

@Entity("terms")
@ObjectType()
export class Term {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Column({ type: "varchar", length: 64 })
  @Field()
  name: string;

  @Column({ type: "date" })
  @Field()
  startDate: Date;

  @Column({ type: "date" })
  @Field()
  endDate: Date;

  @OneToMany(type => Holiday, holiday => holiday.term)
  @Field(type => [Holiday])
  holidays: Holiday[];

  @OneToMany(type => Section, section => section.term)
  @Field(type => [Section])
  sections: Section[];
}

@InputType()
export class TermCreateInput {
  @Field()
  name: string;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;
}

export interface TermWhereUniqueInput {
  id?: number;
}

export interface TermWhereInput {
  name?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface TermUpdateInput {
  name?: string;
  startDate?: Date;
  endDate?: Date;
}

export enum TermOrderByInput {
  nameAsc,
  nameDesc,
  startDateAsc,
  startDateDesc,
  endDateAsc,
  endDateDesc
}
