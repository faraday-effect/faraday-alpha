// ----- TERMS -----
// Generated 2019-04-27 19:12:17

import { Field, Int, ObjectType, InputType } from "type-graphql";
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
  @Field(type => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field(type => [Holiday])
  holidays: Holiday[];

  @Field(type => [Section])
  sections: Section[];
}

export interface TermWhereUniqueInput {
  id?: number;
}

export interface TermWhereInput {
  id?: number;
  name?: string;
  startDate?: Date;
  endDate?: Date;
  holidays?: Holiday[];
  sections?: Section[];
}

export interface TermUpdateInput {
  id?: number;
  name?: string;
  startDate?: Date;
  endDate?: Date;
  holidays?: Holiday[];
  sections?: Section[];
}

export enum TermOrderByInput {
  idAsc,
  idDesc,
  nameAsc,
  nameDesc,
  startDateAsc,
  startDateDesc,
  endDateAsc,
  endDateDesc,
  holidaysAsc,
  holidaysDesc,
  sectionsAsc,
  sectionsDesc
}
